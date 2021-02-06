
function getCategoryData(pk, startsWithDate, endsWithDate) {
    var params = {
        TableName: 'blitzbudget',
        KeyConditionExpression: "pk = :pk and sk BETWEEN :bt1 AND :bt2",
        ExpressionAttributeValues: {
            ":pk": pk,
            ":bt1": "Category#" + startsWithDate,
            ":bt2": "Category#" + endsWithDate
        },
        ProjectionExpression: "pk, sk, category_name, category_total, category_type"
    };

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("data retrieved - Category %j", data.Count);
                transactionData['Category'] = data.Items;
                resolve({
                    "Category": data.Items
                });
            }
        });
    });
}