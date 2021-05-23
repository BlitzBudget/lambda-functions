// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

const addHelper = require('./utils/add-helper');
const util = require('./utils/util');

// Set the region
AWS.config.update({
  region: process.env.AWS_LAMBDA_REGION,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log('adding transactions for ', JSON.stringify(event['body-json']));
  const events = [];

  await addHelper.addANewDateIfNotPresent(event, events, documentClient);

  await addHelper.addANewCategoryIfNotPresent(event, events, documentClient);

  const response = await addHelper.addAllItems(events, event, documentClient);

  const allResponses = event;
  allResponses['body-json'].transactionId = response.transactionId;
  allResponses['body-json'].recurrence = response.nextRecurrence;
  allResponses['body-json'].dateMeanfor = util.isNotEmpty(response.dateId) ? response.dateId : allResponses['body-json'].dateMeantFor;
  allResponses['body-json'].category = util.isNotEmpty(response.categoryId) ? response.categoryId : allResponses['body-json'].category;
  return allResponses;
};
