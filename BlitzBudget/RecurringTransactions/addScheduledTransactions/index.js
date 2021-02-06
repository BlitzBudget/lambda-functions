// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'eu-west-1'
});

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();
let nextSchArray = [];
let events = [];
let recurringTransactionsNextSch;

exports.handler = async (event) => {
    let requestArr = [];
    nextSchArray = [];
    events = [];
    let datesMap = {};
    let categoryMap = {};
    let { walletId, category, categoryType, categoryName, recurringTransactionsId } = extractVariablesFromRequest(event);
    calculateNextScheduledDates(event);
    console.log(" The dates to create are %j", nextSchArray.toString());

    fetchDatesForWallet(walletId);

    await calculateAndAddAllDates(requestArr, walletId, datesMap);

    await calculateAndAddAllCategories(category, walletId, categoryType, categoryName, categoryMap, requestArr, datesMap);

    constructRequestAndCreateItems(requestArr, datesMap, categoryMap, event);

    await updateRecurringTransaction(walletId, recurringTransactionsId);
}
