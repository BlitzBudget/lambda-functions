// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

const addHelper = require('./utils/add-helper');
const updateHelper = require('./utils/update-helper');

// Set the region
AWS.config.update({ region: 'eu-west-1' });

// Create the DynamoDB service object
const dynamoDB = new AWS.DynamoDB();
const documentClient = dynamoDB.DocumentClient();

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
