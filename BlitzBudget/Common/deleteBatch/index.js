// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

const helper = require('./utils/helper');
const deleteHelper = require('./utils/delete-helper');

// Set the region
AWS.config.update({ region: 'eu-west-1' });

// Create the DynamoDB service object
const DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log(`event %j${JSON.stringify(event['body-json'])}`);
  const { result, walletId } = helper.extractVariablesFromRequest(event);
  const events = [];

  if (helper.noItemsInRequest(result)) {
    console.log('There are no items to delete for the wallet %j', walletId);
    return event;
  }

  await deleteHelper.deleteAllItemsInBulk(result, walletId, events, DB);

  return event;
};
