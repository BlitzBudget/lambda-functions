// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

const helper = require('./utils/helper');
const constants = require('./constants/constant');
const deleteHelper = require('./utils/delete-helper');

// Set the region
AWS.config.update({
  region: constants.EU_WEST_ONE,
});

// Create the DynamoDB service object
const DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log(`event ${JSON.stringify(event)}`);
  const { walletId } = event['body-json'];
  const accountToDelete = event['body-json'].account;

  // Recurring Transactions and Transactions
  const result = await helper.fetchAccountsTransactionData(
    walletId,
    DB,
  );

  await deleteHelper.buildRequestAndDeleteAccount(
    result,
    walletId,
    accountToDelete,
    DB,
  );

  return event;
};
