var wallet = function () { };

/*
 * Wallet data
 */
wallet.prototype.getWalletData  = function getWalletData(userId, walletId, docClient, goalData) {
    console.log("fetching the wallet information for the user %j", userId, " with the wallet ", walletId);
    var params = createParameter()

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.get(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                organizeRetrivedItems(data);
                resolve({
                    "Wallet": data
                });
            }
        });
    });

    function organizeRetrivedItems(data) {
        console.log("data retrieved - Wallet %j", JSON.stringify(data));
        if (data.Item) {
            data.Item.walletId = data.Item.sk;
            data.Item.userId = data.Item.pk;
            delete data.Item.sk;
            delete data.Item.pk;
        }
        goalData['Wallet'] = data.Item;
    }

    function createParameter() {
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

wallet.prototype.getWalletsData = function getWalletsData(userId, docClient, goalData) {
    var params = createParameter();

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                organizeRetrivedItems(data);
                resolve({
                    "Wallet": data.Items
                });
            }
        });
    });

    function organizeRetrivedItems(data) {
        console.log("data retrieved - Wallet %j", data.Count);
        if (data.Items) {
            for (const walletObj of data.Items) {
                walletObj.walletId = walletObj.sk;
                walletObj.userId = walletObj.pk;
                delete walletObj.sk;
                delete walletObj.pk;
            }
        }
        goalData['Wallet'] = data.Items;
    }

    function createParameter() {
        return {
            TableName: 'blitzbudget',
            KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":pk": userId,
                ":items": "Wallet#"
            },
            ProjectionExpression: "currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance"
        };
    }
}

// Export object
module.exports = new wallet();