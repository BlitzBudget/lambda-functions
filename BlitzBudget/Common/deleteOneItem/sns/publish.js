var publish = function () { };

publish.prototype.publishToResetAccountsSNS = (item, sns) => {
    var params = {
        Message: item,
        MessageAttributes: {
            "delete_all_items_in_wallet": {
                "DataType": "String",
                "StringValue": "execute"
            }
        },
        TopicArn: 'arn:aws:sns:eu-west-1:064559090307:ResetAccountSubscriber'
    };
    
    return new Promise((resolve, reject) => {
        sns.publish(params,  function(err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                resolve( "Reset account to SNS published");
            }
        }); 
    });
}

// Export object
module.exports = new publish();