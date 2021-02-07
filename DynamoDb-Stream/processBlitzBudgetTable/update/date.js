var date = function () { };

function updateDateItem(pk, sk, difference, income, expense) {
    let params = {
        TableName: 'blitzbudget',
        Key: {
            "pk": pk,
            "sk": sk
        },
        UpdateExpression: "set balance = balance + :ab, income_total = income_total + :it, expense_total = expense_total + :et",
        ConditionExpression: 'attribute_exists(balance)',
        ExpressionAttributeValues: {
            ":ab": difference,
            ":it": income,
            ":et": expense
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

date.prototype.updateDateItem = updateDateItem;
// Export object
module.exports = new date();