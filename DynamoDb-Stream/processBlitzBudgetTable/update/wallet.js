var wallet = function () { };

function updateWalletBalanceItem(pk, sk, balance, assetBalance, debtBalance) {
    let params = {
        TableName: 'blitzbudget',
        Key: {
            "pk": pk,
            "sk": sk
        },
        UpdateExpression: "set wallet_balance = wallet_balance + :ab, total_asset_balance = total_asset_balance + :tab, total_debt_balance = total_debt_balance + :dab",
        ConditionExpression: 'attribute_exists(wallet_balance)',
        ExpressionAttributeValues: {
            ":ab": balance,
            ":tab": assetBalance,
            ":dab": debtBalance,
        },
        ReturnValues: "NONE"
    };

    console.log("Updating the item...");
    return new Promise((resolve, reject) => {
        docClient.update(params, function (err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                resolve(data);
            }
        });
    });
}

wallet.prototype.updateWalletBalanceItem = updateWalletBalanceItem;
// Export object
module.exports = new wallet();