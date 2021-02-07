var budget = function () { };

// Get Budget Item
function getBudgetsItem(walletId, startsWithDate, endsWithDate, docClient) {
    var params = createParameters();

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("data retrieved ", data.Count);
                transactionData['Budget'] = data.Items;
                resolve({
                    "Budget": data.Items
                });
            }
        });
    });

    function createParameters() {
        return {
            TableName: 'blitzbudget',
            KeyConditionExpression: "pk = :walletId AND sk BETWEEN :bt1 AND :bt2",
            ExpressionAttributeValues: {
                ":walletId": walletId,
                ":bt1": "Budget#" + startsWithDate,
                ":bt2": "Budget#" + endsWithDate
            },
            ProjectionExpression: "category, planned, sk, pk"
        };
    }
}

budget.prototype.getBudgetsItem = getBudgetsItem;
// Export object
module.exports = new budget(); 