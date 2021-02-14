const addHelper = require('utils/add-helper');
const updateHelper = require('utils/update-helper');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log('updating Budgets for ', JSON.stringify(event['body-json']));
  let events = [];
  let checkIfBudgetIsPresent = true;
  let categoryName;

  ({
    categoryName,
    checkIfBudgetIsPresent,
  } = await addHelper.addANewCategoryIfNotPresent(
    event,
    checkIfBudgetIsPresent,
    events,
    docClient
  ));

  await updateHelper.updateBudgetIfNotPresent(
    categoryName,
    checkIfBudgetIsPresent,
    event,
    events,
    docClient
  );

  return event;
};
