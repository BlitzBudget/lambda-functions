// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const helper = require('./utils/helper');
const fetchCategoryHelper = require('./utils/fetch-category-helper');
const fetchDateHelper = require('./utils/fetch-date-helper');
const addHelper = require('./utils/add-helper');
const constants = require('./constants/constant');

// Set the region
AWS.config.update({
  region: constants.EU_WEST_ONE,
});

// Create the DynamoDB service object
const dynamoDB = new AWS.DynamoDB();
const documentClient = new dynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log('adding Budget for ', JSON.stringify(event['body-json']));
  const today = helper.convertToDate(event);
  const { walletId, dateMeantFor } = helper.extractVariablesFromRequest(event);
  helper.throwErrorIfEmpty(event, walletId);

  const { dateId, events } = await fetchDateHelper
    .calculateAndFetchDate(dateMeantFor, event, walletId);

  const { categoryName, isBudgetPresent } = await fetchCategoryHelper.calculateAndFetchCategory(
    today,
    event,
    events,
  );

  const newBudgetId = await addHelper.addBudgetIfNotAlreadyPresent(
    categoryName,
    isBudgetPresent,
    today,
    event,
    documentClient,
  );

  const response = event['body-json'];
  response.budgetId = newBudgetId;
  response.dateMeantFor = dateId;

  return response;
};
