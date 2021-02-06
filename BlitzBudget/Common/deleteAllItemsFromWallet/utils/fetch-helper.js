var fetchHelper = function () { };

// Get all Items
function getAllItems(walletId, DB) {
    var params = {
        TableName: 'blitzbudget',
        KeyConditionExpression: "pk = :walletId",
        ExpressionAttributeValues: {
            ":walletId": walletId
        },
        ProjectionExpression: "sk"
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


async function fetchAllItemsForWallet(walletId, result, DB) {
    await getAllItems(walletId, DB).then(function (res) {
        console.log("successfully fetched all the items ", res);
        result = res;
    }, function (err) {
        throw new Error("Unable to delete the goals " + err);
    });
    return result;
}

fetchHelper.prototype.fetchAllItemsForWallet = fetchAllItemsForWallet;

// Export object
module.exports = new fetchHelper();