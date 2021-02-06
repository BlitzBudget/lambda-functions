/*
 * Get Date Data
 */
function getDateData(pk, today) {
    var params = {
        TableName: 'blitzbudget',
        KeyConditionExpression: "pk = :pk AND begins_with(sk, :items)",
        ExpressionAttributeValues: {
            ":pk": pk,
            ":items": "Date#" + today.substring(0, 4) + '-' + today.substring(5, 7)
        },
        ProjectionExpression: "pk, sk"
    };

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        DB.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("data retrieved - Date %j", data.Count, " for the date ", today);
                if (data.Count != 0) {
                    resolve({
                        "Date": data.Items
                    });
                }
                resolve({
                    "dateToCreate": today
                });
            }
        });
    });
}
