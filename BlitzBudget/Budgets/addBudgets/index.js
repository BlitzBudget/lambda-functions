// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

const helper = require('./utils/helper');
const fetchHelper = require('./utils/fetch-helper');
const addHelper = require('./utils/add-helper');

// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log('adding Budget for ', JSON.stringify(event['body-json']));

  const today = helper.convertToDate(event);
  const {
    walletId,
    dateMeantFor,
  } = helper.extractVariablesFromRequest(event);

  helper.throwErrorIfEmpty(event, walletId);

  const { dateId, events } = await fetchHelper.calculateAndFetchDate(
    dateMeantFor,
    event,
    walletId,
  );

  const {
    categoryName,
    isBudgetPresent,
  } = await fetchHelper.calculateAndFetchCategory(
    today,
    event,
    events,
  );

  const newBudgetId = await addHelper.addBudgetIfNotAlreadyPresent(
    categoryName,
    isBudgetPresent,
    today,
    event,
    docClient,
  );

  const response = event['body-json'];
  response.budgetId = newBudgetId;
  response.dateMeantFor = dateId;

  return response;
};
