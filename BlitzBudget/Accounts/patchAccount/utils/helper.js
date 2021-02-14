var helper = function () {};

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();
const fetchBudget = require('../fetch/budget');
const updateBudget = require('../update/budget');
const parameters = require('parameters');

let isEmpty = (obj) => {
  // Check if objext is a number or a boolean
  if (typeof obj == 'number' || typeof obj == 'boolean') return false;

  // Check if obj is null or undefined
  if (obj == null || obj === undefined) return true;

  // Check if the length of the obj is defined
  if (typeof obj.length != 'undefined') return obj.length == 0;

  // check if obj is a custom obj
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }

  return true;
};

let isNotEmpty = (obj) => {
  return !isEmpty(obj);
};

let updateBankAccountToUnselected = (result, events) => {
  let bankAccounts = result.Account;
  if (isNotEmpty(bankAccounts)) {
    for (const account of bankAccounts) {
      if (account['selected_account']) {
        console.log('The account %j is being unselected', account.sk);
        let result = {};
        result['body-json'] = {};
        result['body-json'].selectedAccount = false;
        result['body-json'].walletId = account.pk;
        result['body-json'].accountId = account.sk;
        events.push(updateBudget.updatingBankAccounts(result));
      }
    }
  } else {
    console.log('There are no bank accounts to unselect');
  }
};

async function unselectSelectedBankAccount(event, events) {
  if (isNotEmpty(event['body-json'].selectedAccount)) {
    await fetchBudget.getBankAccountItem(event['body-json'].walletId).then(
      function (result) {
        updateBankAccountToUnselected(result, events);
      },
      function (err) {
        throw new Error(
          'Unable error occured while fetching the BankAccount ' + err
        );
      }
    );
  }
}

async function handleUpdateBankAccounts(events, event) {
  if (isEmpty(event['body-json'])) {
    return;
  }

  var params = buildParameterToUpdate(
    event,
    updateExp,
    expAttrNames,
    expAttrVal
  );

  events.push(updateBudget.updatingBankAccounts(params));
  await Promise.all(events).then(
    function (result) {
      console.log('successfully patched the BankAccounts');
    },
    function (err) {
      throw new Error('Unable to patch the BankAccounts ' + err);
    }
  );
}

let buildParameterToUpdate = (event) => {
  let updateExp = 'set';
  let expAttrVal = {};
  let expAttrNames = {};

  for (let i = 0, len = parameters.length; i < len; i++) {
    let prm = parameters[i];

    // If the parameter is not found then do not save
    if (isEmpty(event['body-json'][prm.prmName])) {
      continue;
    }

    // Add a comma to update expression
    if (includesStr(updateExp, '#variable')) {
      updateExp += ',';
    }

    console.log('param name - ' + event['body-json'][prm.prmName]);

    updateExp += ' #variable' + i + ' = :v' + i;
    expAttrVal[':v' + i] = event['body-json'][prm.prmName];
    expAttrNames['#variable' + i] = prm.prmValue;
  }

  console.log(
    ' update expression ',
    JSON.stringify(updateExp),
    ' expression attribute value ',
    JSON.stringify(expAttrVal),
    ' expression Attribute Names ',
    JSON.stringify(expAttrNames),
    ' for the account id ',
    event['body-json'].accountId
  );
  if (isEmpty(expAttrVal)) {
    return;
  }

  updateExp += ', #update = :u';
  expAttrVal[':u'] = new Date().toISOString();
  expAttrNames['#update'] = 'updated_date';

  return {
    TableName: 'blitzbudget',
    Key: {
      pk: event['body-json'].walletId,
      sk: event['body-json'].accountId,
    },
    UpdateExpression: updateExp,
    ExpressionAttributeNames: expAttrNames,
    ExpressionAttributeValues: expAttrVal,
  };
};

helper.prototype.buildParameterToUpdate = buildParameterToUpdate;

helper.prototype.handleUpdateBankAccounts = handleUpdateBankAccounts;

helper.prototype.isEmpty = isEmpty;

helper.prototype.isNotEmpty = isNotEmpty;

helper.prototype.includesStr = (arr, val) => {
  return isEmpty(arr) ? null : arr.includes(val);
};

helper.prototype.updateBankAccountToUnselected = updateBankAccountToUnselected;

helper.prototype.unselectSelectedBankAccount = unselectSelectedBankAccount;

// Export object
module.exports = new helper();
