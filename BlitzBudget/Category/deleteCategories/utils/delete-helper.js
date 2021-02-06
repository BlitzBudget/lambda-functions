var deleteHelper = function () { };

const deleteItems = require('../delete/items');
const helper = require('helper');

async function bulkDeleteItems(events, result, walletId, event, DB) {
    events = buildBulkDeleteItemsRequest(result, walletId, event, events, DB);

    await Promise.all(events).then(function () {
        console.log("successfully deleted all the items");
    }, function (err) {
        throw new Error("Unable to delete all the items " + err);
    });
    return events;
}

function buildBulkDeleteItemsRequest(result, walletId, event, events, DB) {
    console.log("Starting to process the batch delete request for the transactions %j", result[0].Count, " and for the budgets ", result[1].Count);
    let requestArr = [];

    // Remove Category
    requestArr.push({
        "DeleteRequest": {
            "Key": {
                "pk": walletId,
                "sk": event['body-json'].category
            }
        }
    });

    // Result contains both Transaction and Budget items
    for (const items of result) {
        // Iterate through Transaction Item first and then Budget Item
        for (const item of items.Items) {
            // If transactions and budgets contain the category.
            if (helper.isEqual(item.category, event['body-json'].category)) {
                console.log("Building the delete params for the item %j", item.sk);
                requestArr.push({
                    "DeleteRequest": {
                        "Key": {
                            "pk": walletId,
                            "sk": item.sk
                        }
                    }
                });
            }
        }
    }

    // Split array into sizes of 25
    let deleteRequests = helper.chunkArrayInGroups(requestArr, 25);

    // Push Events  to be executed in bulk
    events = pushToBuildDelete(events, deleteRequests, DB);
    return events;
}

function pushToBuildDelete(events, deleteRequests, DB) {
    events = [];
    for (const deleteRequest of deleteRequests) {
        let params = {};
        params.RequestItems = {};
        params.RequestItems.blitzbudget = deleteRequest;
        console.log("The delete request is in batch  with length %j", params.RequestItems.blitzbudget.length);
        // Delete Items in batch
        events.push(deleteItems.deleteItems(params, DB));
    }
    return events;
}

deleteHelper.prototype.bulkDeleteItems = bulkDeleteItems;

var deleteHelper = function () { };