
function constructRequestAndCreateItems(requestArr, datesMap, categoryMap, event) {
    console.log(" The number of dates and categories to create are %j", requestArr.length);
    // Add all transactions
    constructTransactionsWithDateMeantForAndCategory(datesMap, categoryMap, event, requestArr);
    console.log(" The number of transactions to create are %j", requestArr.length);

    // Split array into sizes of 25
    let putRequests = chunkArrayInGroups(requestArr, 25);

    // Push Events  to be executed in bulk
    createAllItemsInBatch(putRequests);
}

/*
* Start processing categories
*/
async function calculateAndAddAllCategories(category, walletId, categoryType, categoryName, categoryMap, requestArr, datesMap) {
    await calculateCategoriesToAdd(category, walletId, categoryType, categoryName, categoryMap, requestArr, datesMap);

    /*
     * Add all categories first
     */
    await addAllCategories();
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

async function addAllCategories() {
    await Promise.all(events).then(function () {
        events = [];
        console.log("Successfully inserted the categories field %j", recurringTransactionsNextSch);
    }, function (err) {
        throw new Error("Unable to update the recurring transactions field " + err);
    });
}

async function calculateCategoriesToAdd(category, walletId, categoryType, categoryName, categoryMap, requestArr, datesMap) {
    pushAllCategoriesToFetch(category, walletId, categoryType, categoryName);

    /*
     * Publish events to get category data
     */
    await Promise.all(events).then(function (result) {
        events = [];
        console.log("Processing Categories to create");
        for (const categoryItem of result) {
            categoryMap[categoryItem.dateMeantFor] = categoryItem.sortKey;
            requestArr.push(buildParamsForCategory(walletId, categoryItem.sortKey, categoryType, categoryName, datesMap[categoryItem.dateMeantFor]));
        }
    }, function (err) {
        throw new Error("Unable to get the category for the recurring transaction" + err);
    });
}