const helper = require('utils/helper');
const resetHelper = require('utils/reset-helper');
const deleteHelper = require('utils/delete-helper');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'eu-west-1'});
var sns = new AWS.SNS();

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  let {pk, sk, fromSns} = helper.extractVariablesFromRequest(event);
  await deleteHelper.deleteAnItem(pk, sk, DB);

  await resetHelper.resetAccount(fromSns, sk, sns);

  return event;
};
