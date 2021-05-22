// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

const helper = require('./utils/helper');
const deleteHelper = require('./utils/delete-helper');

// Set the region
AWS.config.update({ region: process.env.AWS_LAMBDA_REGION });

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log(`event %j${JSON.stringify(event['body-json'])}`);
  const { result, walletId } = helper.extractVariablesFromRequest(event);
  const events = [];

  if (helper.noItemsInRequest(result)) {
    console.log('There are no items to delete for the wallet %j', walletId);
    return event;
  }

  await deleteHelper.deleteAllItemsInBulk(result, walletId, events, documentClient);

  return event;
};
