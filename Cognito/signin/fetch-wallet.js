var fetchWallet = function () { };

fetchWallet.prototype.getWallet = (userId, docClient) => {
    var params = {
        TableName: 'blitzbudget',
        KeyConditionExpression: "pk = :userId and begins_with(sk, :items)",
        ExpressionAttributeValues: {
            ":userId": userId,
            ":items": "Wallet#"
        },
        ProjectionExpression: "currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance"
    };

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("data retrieved ", data.Count);
                for (const walletObj of data.Items) {
                    walletObj.walletId = walletObj.sk;
                    walletObj.userId = walletObj.pk;
                    delete walletObj.sk;
                    delete walletObj.pk;
                }
                resolve(data.Items);
            }
        });
    });
}

// Export object
module.exports = new fetchWallet();
