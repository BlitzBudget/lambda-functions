var addHelper = function () { };

const addTransaction = require('../create-parameters/transaction');
const addCategoryParam = require('../create-parameters/category');
const batchWriteItems = require('../add/batch-write');
const fetchHelper = require('fetch-helper');
const helper = require('helper');

function constructRequestAndCreateItems(addItemArray, datesMap, categoryMap, event, DB) {
    console.log(" The number of dates and categories to create are %j", addItemArray.length);
    // Add all transactions
    addTransaction.constructTransactionsWithDateMeantForAndCategory(datesMap, categoryMap, event, addItemArray);
    console.log(" The number of transactions to create are %j", addItemArray.length);

    // Split array into sizes of 25
    let putRequests = helper.chunkArrayInGroups(addItemArray, 25);

    // Push Events  to be executed in bulk
    createAllItemsInBatch(putRequests, DB);
}

/*
* Start processing categories
*/
async function calculateAndAddAllCategories(category, walletId, categoryType, categoryName, categoryMap, addItemArray, datesMap, events, DB) {
    await calculateCategoriesToAdd(category, walletId, categoryType, categoryName, categoryMap, addItemArray, datesMap, events, DB);

    /*
     * Add all categories first
     */
    await addAllCategories(events);
}

function createAllItemsInBatch(putRequests, DB) {
    for (const putRequest of putRequests) {
        let params = {};
        params.RequestItems = {};
        params.RequestItems.blitzbudget = putRequest;
        console.log("The put request is in batch  with length %j", params.RequestItems.blitzbudget.length);
        // Delete Items in batch
        events.push(batchWriteItems.batchWriteItems(params, DB));
    }
}

async function addAllCategories(events) {
    await Promise.all(events).then(function () {
        events = [];
        console.log("Successfully inserted the categories field %j", recurringTransactionsNextSch);
    }, function (err) {
        throw new Error("Unable to update the recurring transactions field " + err);
    });
}

async function calculateCategoriesToAdd(category, walletId, categoryType, categoryName, categoryMap, addItemArray, datesMap, events, DB) {
    fetchHelper.pushAllCategoriesToFetch(category, walletId, categoryType, categoryName, DB);

    /*
     * Publish events to get category data
     */
    await Promise.all(events).then(function (result) {
        events = [];
        console.log("Processing Categories to create");
        for (const categoryItem of result) {
            categoryMap[categoryItem.dateMeantFor] = categoryItem.sortKey;
            addItemArray.push(addCategoryParam.buildParamsForCategory(walletId, categoryItem.sortKey, categoryType, categoryName, datesMap[categoryItem.dateMeantFor]));
        }
    }, function (err) {
        throw new Error("Unable to get the category for the recurring transaction" + err);
    });
}

addHelper.prototype.constructRequestAndCreateItems = constructRequestAndCreateItems;
addHelper.prototype.calculateAndAddAllCategories = calculateAndAddAllCategories

// Export object
module.exports = new addHelper(); 