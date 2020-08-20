// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({
    region: 'eu-west-1'
});

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('event ' + JSON.stringify(event));
    let walletId = event['body-json'].walletId;
    let curentPeriod = event['body-json'].category.substring(9, 16);
    let result = {};
    let events = [];

    // Get Transactions and Budget Items
    events.push(getTransactionItems(walletId, curentPeriod));
    events.push(getBudgetItems(walletId, curentPeriod));

    await Promise.all(events).then(function (res) {
        console.log("successfully fetched all the items ");
        result = res;
    }, function (err) {
        throw new Error("Unable to delete the categories " + err);
    });

    if (result.Count == 0) {
        console.log("There are no items to delete for the wallet %j", walletId);
        return event;
    }

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
            if (isEqual(item.category, event['body-json'].category)) {
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
    let deleteRequests = chunkArrayInGroups(requestArr, 25);

    // Push Events  to be executed in bulk
    events = [];
    for (const deleteRequest of deleteRequests) {
        let params = {};
        params.RequestItems = {};
        params.RequestItems.blitzbudget = deleteRequest;
        console.log("The delete request is in batch  with length %j", params.RequestItems.blitzbudget.length);
        // Delete Items in batch
        events.push(deleteItems(params));
    }


    await Promise.all(events).then(function (result) {
        console.log("successfully deleted all the items");
    }, function (err) {
        throw new Error("Unable to delete all the items " + err);
    });

    return event;
};

// Splits array into chunks
function chunkArrayInGroups(arr, size) {
    var myArray = [];
    for (var i = 0; i < arr.length; i += size) {
        myArray.push(arr.slice(i, i + size));
    }
    return myArray;
}

// Get all transaction Items
function getTransactionItems(walletId, currentPeriod) {
    var params = {
        TableName: 'blitzbudget',
        KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
        ExpressionAttributeValues: {
            ":pk": walletId,
            ":items": "Transaction#" + currentPeriod
        },
        ProjectionExpression: "amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags"
    };

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        DB.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("data retrieved ", JSON.stringify(data.Items));
                resolve(data);
            }
        });
    });
}

// Get all budget Items
function getBudgetItems(walletId, currentPeriod) {
    var params = {
        TableName: 'blitzbudget',
        KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
        ExpressionAttributeValues: {
            ":pk": walletId,
            ":items": "Budget#" + currentPeriod
        },
        ProjectionExpression: "category, planned, sk, pk"
    };

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        DB.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("data retrieved ", JSON.stringify(data.Items));
                resolve(data);
            }
        });
    });
}


function deleteItems(params) {

    return new Promise((resolve, reject) => {
        DB.batchWrite(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("All items are successfully deleted");
                resolve({
                    "success": data
                });
            }
        });
    });
}

function isEqual(obj1, obj2) {
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true;
    }
    return false;
}
