const AWS = require('aws-sdk');
const util = require('./utils/util');
const resetHelper = require('./utils/reset-helper');
const deleteHelper = require('./utils/delete-helper');
const constants = require('./constants/constant');

// Load the AWS SDK for Node.js
// Set the region
AWS.config.update({ region: constants.TABLE_NAME });
const sns = new AWS.SNS();

// Create the DynamoDB service object
const dynamoDB = new AWS.DynamoDB();
const documentClient = new dynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { pk, sk, fromSns } = util.extractVariablesFromRequest(event);
  await deleteHelper.deleteAnItem(pk, sk, documentClient);

  await resetHelper.resetAccount(fromSns, sk, sns);

  return event;
};
