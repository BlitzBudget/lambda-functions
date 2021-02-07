var fetchVoiceCode = function () { };

/*
 * Get New Voice Code
 */
function getNewVoiceCode(userId, docClient) {
    var params = createParameters();

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("data retrieved ", JSON.stringify(data.Items));
                resolve(data);
            }
        });
    });

    function createParameters() {
        return {
            TableName: 'blitzbudget',
            KeyConditionExpression: "pk = :userId and begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":userId": userId,
                ":items": "AlexaVoiceCode#"
            },
            ProjectionExpression: "voice_code, sk, pk"
        };
    }
}

fetchVoiceCode.prototype.getNewVoiceCode = getNewVoiceCode;
// Export object
module.exports = new fetchVoiceCode();