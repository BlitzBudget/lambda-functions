// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const fetchHelper = require('./utils/fetch-helper');
const constants = require('./constants/constant');
const updateHelper = require('./utils/update-helper');

// Set the region
AWS.config.update({
  region: constants.EU_WEST_ONE,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const events = [];
  console.log('updating transactions for ', JSON.stringify(event['body-json']));

  await fetchHelper.calculateAndFetchCategory(event, events, documentClient);

  const response = await updateHelper.updateRecurringTransaction(events, event, documentClient);

  const patchResponse = event['body-json'];
  // patchResponse.category = response.Category.Attributes.sk;
  patchResponse.category = response.Transaction.Attributes.category;
  patchResponse.amount = response.Transaction.Attributes.amount;

  return patchResponse;
};
