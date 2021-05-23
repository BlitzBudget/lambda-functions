// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const helper = require('./utils/helper');
const fetchHelper = require('./utils/fetch-helper');
const addHelper = require('./utils/add-helper');
const updateHelper = require('./utils/update-helper');
const scheduledDates = require('./tools/scheduled-dates');

// Set the region
AWS.config.update({
  region: process.env.AWS_LAMBDA_REGION,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const datesToCreateTransactions = [];
  const datesMap = {};
  const categoryMap = {};
  const {
    walletId,
    category,
    categoryType,
    categoryName,
    recurringTransactionsId,
  } = helper.extractVariablesFromRequest(event);
  const futureCreationDateForRecurringTransaction = scheduledDates.calculateNextDateToCreates(
    event,
    datesToCreateTransactions,
  );

  await fetchHelper.calculateAndAddAllDates(
    datesToCreateTransactions,
    walletId,
    datesMap,
    documentClient,
  );

  await addHelper.calculateAndAddAllCategories(
    category,
    walletId,
    categoryType,
    categoryName,
    categoryMap,
    datesToCreateTransactions,
    datesMap,
    documentClient,
  );

  addHelper.constructRequestAndCreateItems(
    datesToCreateTransactions,
    datesMap,
    categoryMap,
    event,
    documentClient,
  );

  await updateHelper.updateRecurringTransaction(
    walletId,
    recurringTransactionsId,
    futureCreationDateForRecurringTransaction,
    documentClient,
    datesToCreateTransactions,
  );
};
