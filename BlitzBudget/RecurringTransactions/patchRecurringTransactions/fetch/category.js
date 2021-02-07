var fetchCategory = function () { };

const helper = require('../utils/helper');

function getCategoryData(docClient, event, today) {
    var params = createParameter();

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("data retrieved - Category %j", data.Count);
                let obj;
                if (helper.isNotEmpty(data.Items)) {
                    for (const categoryObj of data.Items) {
                        if (isEqual(categoryObj['category_type'], event['body-json'].categoryType) &&
                            isEqual(categoryObj['category_name'], event['body-json'].category)) {
                            console.log("Found a match for the mentioned category %j", categoryObj.sk);
                            obj = categoryObj;
                        }
                    }
                }

                if (helper.isEmpty(obj)) {
                    console.log("No matching categories found");
                }

                resolve({
                    "Category": obj
                });
            }
        });
    });

    function createParameter() {
        return {
            TableName: 'blitzbudget',
            KeyConditionExpression: "pk = :pk AND begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":pk": event['body-json'].walletId,
                ":items": "Category#" + today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2)
            },
            ProjectionExpression: "pk, sk, category_name, category_type"
        };
    }
}

fetchCategory.prototype.getCategoryData = getCategoryData;
// Export object
module.exports = new fetchCategory(); 