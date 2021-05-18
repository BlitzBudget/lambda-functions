// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

const fetchHelper = require('./utils/fetch-helper');
const constants = require('./constants/constant');
const deleteHelper = require('./utils/delete-helper');

// Set the region
AWS.config.update({
  region: constants.AWS_LAMBDA_REGION,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { walletId } = event['body-json'];
  const accountId = event['body-json'].account;

  // Recurring Transactions and Transactions
  const result = await fetchHelper.fetchTransactionDataForAccount(
    walletId,
    documentClient,
  );

  await deleteHelper.buildRequestAndDeleteAccount(
    result,
    walletId,
    accountId,
    documentClient,
  );

  return event;
};
