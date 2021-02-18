// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const helper = require('./utils/helper');
const fetchHelper = require('./utils/fetch-helper');
const addHelper = require('./utils/add-helper');
const updateHelper = require('./utils/update-helper');
const scheduledDates = require('./utils/scheduled-dates');

// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
const DB = new AWS.DynamoDB.DocumentClient();

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
    DB,
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
    DB,
    futureTransactionCreationDate,
  );

  addHelper.constructRequestAndCreateItems(
    addItemArray,
    datesMap,
    categoryMap,
    event,
    DB,
    events,
  );

  await updateHelper.updateRecurringTransaction(
    walletId,
    recurringTransactionsId,
    futureTransactionCreationDate,
    DB,
    events,
  );
};
