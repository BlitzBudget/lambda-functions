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
  region: constants.EU_WEST_ONE,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const addItemArray = [];
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
    addItemArray,
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
    addItemArray,
    datesMap,
    events,
    documentClient,
    futureTransactionCreationDate,
  );

  addHelper.constructRequestAndCreateItems(
    addItemArray,
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
