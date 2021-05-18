// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const addHelper = require('./utils/add-helper');
const constants = require('./constants/constant');
const updateHelper = require('./utils/update-helper');

// Set the region
AWS.config.update({
  region: constants.AWS_LAMBDA_REGION,
});

// Create the DynamoDB service object
const dynamoDB = new AWS.DynamoDB();
const documentClient = dynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log('updating transactions for ', JSON.stringify(event['body-json']));

  const events = await addHelper.addANewCategoryIfNotPresent(event, documentClient);

  const response = await updateHelper.updateRecurringTransaction(events, event, documentClient);

  const patchResponse = event;
  patchResponse['body-json'].category = response.Transaction.category;
  patchResponse['body-json'].amount = response.Transaction.amount;

  return patchResponse;
};
