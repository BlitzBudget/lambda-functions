function Helper() {}

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const constants = require('../constants/constant');
const util = require('./util');
const fetchBankAccount = require('../fetch/bank-account');
const updateBankAccountParameter = require('../create-parameter/update-bank-account');
const updateBankAccount = require('../update/bank-account');
const updateHelper = require('./update-helper');

// Set the region
AWS.config.update({
  region: constants.EU_WEST_ONE,
});

// Create the DynamoDB service object
const dynamoDB = new AWS.DynamoDB();
const documentClient = new dynamoDB.DocumentClient();

async function unselectSelectedBankAccount(event) {
  let events = [];
  if (util.isNotEmpty(event['body-json'].selectedAccount)) {
    await fetchBankAccount.getBankAccountItem(event['body-json'].walletId, documentClient).then(
      (result) => {
        events = updateHelper.updateBankAccountToUnselected(result, documentClient);
      },
      (err) => {
        throw new Error(
          `Unable error occured while fetching the BankAccount ${err}`,
        );
      },
    );
  }
  return events;
}

async function handleUpdateBankAccounts(events, event) {
  if (util.isEmpty(event['body-json'])) {
    return;
  }

  const params = updateBankAccountParameter.createParameter(
    event,
  );

  events.push(updateBankAccount.updatingBankAccounts(params));
  await Promise.all(events).then(
    () => {
      console.log('successfully patched the BankAccounts');
    },
    (err) => {
      throw new Error(`Unable to patch the BankAccounts ${err}`);
    },
  );
}

Helper.prototype.handleUpdateBankAccounts = handleUpdateBankAccounts;

Helper.prototype.unselectSelectedBankAccount = unselectSelectedBankAccount;

// Export object
module.exports = new Helper();
