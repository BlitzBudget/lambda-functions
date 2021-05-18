// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const helper = require('./utils/helper');
const constants = require('./constants/constant');
const fetchHelper = require('./utils/fetch-helper');
const addHelper = require('./utils/add-helper');
const updateHelper = require('./utils/update-helper');
const scheduledDates = require('./tools/scheduled-dates');

// Set the region
AWS.config.update({
  region: constants.AWS_LAMBDA_REGION,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const createItemsArray = [];
  const datesToCreateTransactions = [];
  let events = [];
  const datesMap = {};
  const categoryMap = {};
  const {
    walletId,
    category,
    categoryType,
    categoryName,
    recurringTransactionsId,
  } = helper.extractVariablesFromRequest(event);
  const futureTransactionCreationDate = scheduledDates.calculateNextDateToCreates(
    event,
    datesToCreateTransactions,
  );

  events = await fetchHelper.calculateAndAddAllDates(
    createItemsArray,
    walletId,
    datesMap,
    events,
    documentClient,
  );

  events = await addHelper.calculateAndAddAllCategories(
    category,
    walletId,
    categoryType,
    categoryName,
    categoryMap,
    createItemsArray,
    datesMap,
    events,
    documentClient,
  );

  addHelper.constructRequestAndCreateItems(
    createItemsArray,
    datesMap,
    categoryMap,
    event,
    documentClient,
    events,
  );

  await updateHelper.updateRecurringTransaction(
    walletId,
    recurringTransactionsId,
    futureTransactionCreationDate,
    documentClient,
    events,
  );
};
