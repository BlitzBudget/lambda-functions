
function getDateData(pk, year) {
    var params = {
        TableName: 'blitzbudget',
        KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
        ExpressionAttributeValues: {
            ":pk": pk,
            ":items": "Date#" + year
        },
        ProjectionExpression: "pk, sk, income_total, expense_total, balance"
    };

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("data retrieved - Date %j", data.Count);
                transactionData['Date'] = data.Items;
                resolve({
                    "Date": data.Items
                });
            }
        });
    });
}