var publish = function () { };

const helper = require('../utils/helper');

function resetAccountSubscriberThroughSNS(event, sns) {
    console.log("Publishing to ResetAccountListener SNS or wallet id - " + event['body-json'].walletId);
    let deleteOneWalletAttribute = helper.isNotEmpty(event['body-json'].referenceNumber) ? "execute" : "donotexecute";

    var params = createParameters();

    return new Promise((resolve, reject) => {
        sns.publish(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                resolve("Reset account to SNS published");
            }
        });
    });

    function createParameters() {
        return {
            Message: event['body-json'].walletId,
            Subject: event['body-json'].referenceNumber,
            MessageAttributes: {
                "delete_one_wallet": {
                    "DataType": "String",
                    "StringValue": deleteOneWalletAttribute
                }
            },
            TopicArn: 'arn:aws:sns:eu-west-1:064559090307:ResetAccountSubscriber'
        };
    }
}

publish.prototype.resetAccountSubscriberThroughSNS = resetAccountSubscriberThroughSNS;
// Export object
module.exports = new publish(); 