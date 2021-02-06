var date = function () { };

function getDateData(pk, startsWithDate, endsWithDate, docClient) {
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
                    "Date": data.Items
                });
            }
        });
    });

    function organizeRetrievedItems(data) {
        console.log("data retrieved - Date ", data.Count);
        if (data.Items) {
            for (const dateObj of data.Items) {
                dateObj.dateId = dateObj.sk;
                dateObj.walletId = dateObj.pk;
                delete dateObj.sk;
                delete dateObj.pk;
            }
        }
        overviewData['Date'] = data.Items;
    }

    function createParameters() {
        return {
            TableName: 'blitzbudget',
            KeyConditionExpression: "pk = :pk and sk BETWEEN :bt1 AND :bt2",
            ExpressionAttributeValues: {
                ":pk": pk,
                ":bt1": "Date#" + startsWithDate,
                ":bt2": "Date#" + endsWithDate
            },
            ProjectionExpression: "pk, sk, income_total, expense_total, balance"
        };
    }
}

date.prototype.getDateData = getDateData;
// Export object
module.exports = new date(); 