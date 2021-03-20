const Helper = () => {};

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const util = require('./util');
// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

const fetchBankAccount = require('../fetch/bank-account');
const updateBankAccountParameter = require('../create-parameter/update-bank-account');
const updateBankAccount = require('../update/bank-account');
const updateHelper = require('./update-helper');

async function unselectSelectedBankAccount(event, events) {
  if (util.isNotEmpty(event['body-json'].selectedAccount)) {
    await fetchBankAccount.getBankAccountItem(event['body-json'].walletId, documentClient).then(
      (result) => {
        updateHelper.updateBankAccountToUnselected(result, events);
      },
      (err) => {
        throw new Error(
          `Unable error occured while fetching the BankAccount ${err}`,
        );
      },
    );
  }
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
