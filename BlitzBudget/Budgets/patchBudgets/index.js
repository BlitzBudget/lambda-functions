// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

const addHelper = require('./utils/add-helper');
const updateHelper = require('./utils/update-helper');

// Set the region
AWS.config.update({ region: process.env.AWS_LAMBDA_REGION });

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log('updating Budgets for ', JSON.stringify(event['body-json']));

  const response = await addHelper.addANewCategoryIfNotPresent(
    event,
    documentClient,
  );

  await updateHelper.updateBudgetIfNotPresent(
    event,
    response.events,
    documentClient,
  );

  return response.createCategoryRequest;
};
