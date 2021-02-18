// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

const addHelper = require('./utils/add-helper');
const updateHelper = require('./utils/update-helper');

// Set the region
AWS.config.update({ region: 'eu-west-1' });

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log('updating Budgets for ', JSON.stringify(event['body-json']));
  const events = [];

  const {
    categoryName,
    isBudgetPresent,
  } = await addHelper.addANewCategoryIfNotPresent(
    event,
    events,
    docClient,
  );

  await updateHelper.updateBudgetIfNotPresent(
    categoryName,
    isBudgetPresent,
    event,
    events,
    docClient,
  );

  return event;
};
