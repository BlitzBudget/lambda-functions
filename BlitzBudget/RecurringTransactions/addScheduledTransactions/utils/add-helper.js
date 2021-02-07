var addHelper = function () { };

function constructRequestAndCreateItems(addItemArray, datesMap, categoryMap, event) {
    console.log(" The number of dates and categories to create are %j", addItemArray.length);
    // Add all transactions
    constructTransactionsWithDateMeantForAndCategory(datesMap, categoryMap, event, addItemArray);
    console.log(" The number of transactions to create are %j", addItemArray.length);

    // Split array into sizes of 25
    let putRequests = chunkArrayInGroups(addItemArray, 25);

    // Push Events  to be executed in bulk
    createAllItemsInBatch(putRequests);
}

/*
* Start processing categories
*/
async function calculateAndAddAllCategories(category, walletId, categoryType, categoryName, categoryMap, addItemArray, datesMap, events) {
    await calculateCategoriesToAdd(category, walletId, categoryType, categoryName, categoryMap, addItemArray, datesMap, events);

    /*
     * Add all categories first
     */
    await addAllCategories(events);
}

function createAllItemsInBatch(putRequests) {
    for (const putRequest of putRequests) {
        let params = {};
        params.RequestItems = {};
        params.RequestItems.blitzbudget = putRequest;
        console.log("The put request is in batch  with length %j", params.RequestItems.blitzbudget.length);
        // Delete Items in batch
        events.push(batchWriteItems(params));
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

async function calculateCategoriesToAdd(category, walletId, categoryType, categoryName, categoryMap, addItemArray, datesMap, events) {
    pushAllCategoriesToFetch(category, walletId, categoryType, categoryName);

    /*
     * Publish events to get category data
     */
    await Promise.all(events).then(function (result) {
        events = [];
        console.log("Processing Categories to create");
        for (const categoryItem of result) {
            categoryMap[categoryItem.dateMeantFor] = categoryItem.sortKey;
            addItemArray.push(buildParamsForCategory(walletId, categoryItem.sortKey, categoryType, categoryName, datesMap[categoryItem.dateMeantFor]));
        }
    }, function (err) {
        throw new Error("Unable to get the category for the recurring transaction" + err);
    });
}

addHelper.prototype.constructRequestAndCreateItems = constructRequestAndCreateItems;
addHelper.prototype.calculateAndAddAllCategories = calculateAndAddAllCategories

// Export object
module.exports = new addHelper(); 