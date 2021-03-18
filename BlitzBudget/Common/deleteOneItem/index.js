const AWS = require('aws-sdk');
const helper = require('./utils/helper');
const resetHelper = require('./utils/reset-helper');
const deleteHelper = require('./utils/delete-helper');
const constants = require('./constants/constant');

// Load the AWS SDK for Node.js
// Set the region
AWS.config.update({ region: constants.TABLE_NAME });
const sns = new AWS.SNS();

// Create the DynamoDB service object
const DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { pk, sk, fromSns } = helper.extractVariablesFromRequest(event);
  await deleteHelper.deleteAnItem(pk, sk, DB);

  await resetHelper.resetAccount(fromSns, sk, sns);

  return event;
};
