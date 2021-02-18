const Helper = () => {};

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient();
const parameters = require('./parameters');
const fetchBudget = require('../fetch/budget');
const updateBudget = require('../update/budget');

const isEmpty = (obj) => {
  // Check if objext is a number or a boolean
  if (typeof obj === 'number' || typeof obj === 'boolean') return false;

  // Check if obj is null or undefined
  if (obj === null || obj === undefined) return true;

  // Check if the length of the obj is defined
  if (typeof obj.length !== 'undefined') return obj.length === 0;

  // check if obj is a custom obj
  if (obj && Object.keys(obj).length !== 0) { return false; }

  return true;
};

const includesStr = (arr, val) => (isEmpty(arr) ? null : arr.includes(val));

const isNotEmpty = (obj) => !isEmpty(obj);

const updateBankAccountToUnselected = (result, events) => {
  const bankAccounts = result.Account;
  if (isNotEmpty(bankAccounts)) {
    Object.keys(bankAccounts).forEach((account) => {
      if (account.selected_account) {
        console.log('The account %j is being unselected', account.sk);
        const updateItem = {};
        updateItem['body-json'] = {};
        updateItem['body-json'].selectedAccount = false;
        updateItem['body-json'].walletId = account.pk;
        updateItem['body-json'].accountId = account.sk;
        events.push(updateBudget.updatingBankAccounts(updateItem, docClient));
      }
    });
  } else {
    console.log('There are no bank accounts to unselect');
  }
};

async function unselectSelectedBankAccount(event, events) {
  if (isNotEmpty(event['body-json'].selectedAccount)) {
    await fetchBudget.getBankAccountItem(event['body-json'].walletId, docClient).then(
      (result) => {
        updateBankAccountToUnselected(result, events);
      },
      (err) => {
        throw new Error(
          `Unable error occured while fetching the BankAccount ${err}`,
        );
      },
    );
  }
}

const buildParameterToUpdate = (event) => {
  let updateExp = 'set';
  const expAttrVal = {};
  const expAttrNames = {};

  for (let i = 0, len = parameters.length; i < len; i++) {
    const prm = parameters[i];

    // If the parameter is not found then do not save
    if (isNotEmpty(event['body-json'][prm.prmName])) {
      // Add a comma to update expression
      if (includesStr(updateExp, '#variable')) {
        updateExp += ',';
      }

      console.log(`param name - ${event['body-json'][prm.prmName]}`);

      updateExp += ` #variable${i} = :v${i}`;
      expAttrVal[`:v${i}`] = event['body-json'][prm.prmName];
      expAttrNames[`#variable${i}`] = prm.prmValue;
    }
  }

  console.log(
    ' update expression ',
    JSON.stringify(updateExp),
    ' expression attribute value ',
    JSON.stringify(expAttrVal),
    ' expression Attribute Names ',
    JSON.stringify(expAttrNames),
    ' for the account id ',
    event['body-json'].accountId,
  );

  if (isEmpty(expAttrVal)) {
    return undefined;
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

async function handleUpdateBankAccounts(events, event) {
  if (isEmpty(event['body-json'])) {
    return;
  }

  const params = buildParameterToUpdate(
    event,
  );

  events.push(updateBudget.updatingBankAccounts(params));
  await Promise.all(events).then(
    () => {
      console.log('successfully patched the BankAccounts');
    },
    (err) => {
      throw new Error(`Unable to patch the BankAccounts ${err}`);
    },
  );
}

Helper.prototype.buildParameterToUpdate = buildParameterToUpdate;

Helper.prototype.handleUpdateBankAccounts = handleUpdateBankAccounts;

Helper.prototype.isEmpty = isEmpty;

Helper.prototype.isNotEmpty = isNotEmpty;

Helper.prototype.includesStr = includesStr;

Helper.prototype.updateBankAccountToUnselected = updateBankAccountToUnselected;

Helper.prototype.unselectSelectedBankAccount = unselectSelectedBankAccount;

// Export object
module.exports = new Helper();
