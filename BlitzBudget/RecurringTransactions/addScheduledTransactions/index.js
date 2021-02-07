const helper = require('utils/helper');
const fetchHelper = require('utils/fetch-helper');
const addHelper = require('utils/add-helper');
const updateHelper = require('utils/update-helper');
const scheduledDates = require('utils/scheduled-dates');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'eu-west-1'
});

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    let futureTransactionCreationDate;
    let addItemArray = [];
    let datesToCreateTransactions = [];
    let events = [];
    let datesMap = {};
    let categoryMap = {};
    let { walletId, category, categoryType, categoryName, recurringTransactionsId } = helper.extractVariablesFromRequest(event);
    scheduledDates.calculateNextDateToCreates(event, futureTransactionCreationDate, datesToCreateTransactions);

    await fetchHelper.calculateAndAddAllDates(addItemArray, walletId, datesMap, events, DB);

    await addHelper.calculateAndAddAllCategories(category, walletId, categoryType, categoryName, categoryMap, addItemArray, datesMap, events, DB);

    addHelper.constructRequestAndCreateItems(addItemArray, datesMap, categoryMap, event, DB);

    await updateHelper.updateRecurringTransaction(walletId, recurringTransactionsId, futureTransactionCreationDate, DB);
}
