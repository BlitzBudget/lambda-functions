var wallet = function () { };

function getWalletData(userId, walletId, overviewData, docClient) {
    console.log("fetching the wallet information for the user %j", userId, " with the wallet ", walletId);
    var params = createParameters()

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.get(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                organizeRetrievedItems(data);
                resolve({
                    "Wallet": data
                });
            }
        });
    });

    function organizeRetrievedItems(data) {
        console.log("data retrieved - Wallet %j", JSON.stringify(data));
        if (data.Item) {
            data.Item.walletId = data.Item.sk;
            data.Item.userId = data.Item.pk;
            delete data.Item.sk;
            delete data.Item.pk;
        }
        overviewData['Wallet'] = data.Item;
    }

    function createParameters() {
        return {
            AttributesToGet: [
                "currency",
                "total_asset_balance",
                "total_debt_balance",
                "wallet_balance"
            ],
            TableName: 'blitzbudget',
            Key: {
                "pk": userId,
                "sk": walletId
            }
        };
    }
}


function getWalletsData(userId, overviewData, docClient) {
    var params = createParameters();

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                organizeRetrievedItems(data);
                resolve({
                    "Wallet": data.Items
                });
            }
        });
    });

    function organizeRetrievedItems(data) {
        console.log("data retrieved - Wallet %j", data.Count);
        if (data.Items) {
            for (const walletObj of data.Items) {
                walletObj.walletId = walletObj.sk;
                walletObj.userId = walletObj.pk;
                delete walletObj.sk;
                delete walletObj.pk;
            }
        }
        overviewData['Wallet'] = data.Items;
    }

    function createParameters() {
        return {
            TableName: 'blitzbudget',
            KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":pk": userId,
                ":items": "Wallet#"
            },
            ProjectionExpression: "currency, pk, sk, read_only, total_asset_balance, total_debt_balance, wallet_balance"
        };
    }
}

wallet.prototype.getWalletData = getWalletData;
wallet.prototype.getWalletsData = getWalletsData;
// Export object
module.exports = new wallet(); 