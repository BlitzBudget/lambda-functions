var fetchDate = function () { };

fetchDate.prototype.getDateData = (pk, today) => {
    var params = {
        TableName: 'blitzbudget',
        KeyConditionExpression: "pk = :pk AND begins_with(sk, :items)",
        ExpressionAttributeValues: {
            ":pk": pk,
            ":items": "Date#" + today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2)
        },
        ProjectionExpression: "pk, sk"
    };

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("data retrieved - Date %j", data.Count);
                resolve({
                    "Date": data.Items
                });
            }
        });
    });
}

// Export object
module.exports = new fetchDate();