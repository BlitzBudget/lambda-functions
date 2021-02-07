
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'eu-west-1'
});

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();

function addNewWallet(event, userId, currency, walletName) {
    let today = new Date();
    let randomValue = "Wallet#" + today.toISOString();

    var params = createParameters();

    console.log("Adding a new item...");
    return new Promise((resolve, reject) => {
        DB.put(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {          
                addInfoToResponse();
                resolve({
                    "success": data
                });
            }
        });
    });

    function addInfoToResponse() {
        if (isNotEmpty(event['body-json'])) {
            event['body-json'].walletId = randomValue;
            event['body-json']['wallet_balance'] = 0;
            event['body-json']['total_debt_balance'] = 0;
            event['body-json']['total_asset_balance'] = 0;
        }
    }

    function createParameters() {
        return {
            TableName: 'blitzbudget',
            Item: {
                "pk": userId,
                "sk": randomValue,
                "currency": currency,
                "wallet_name": walletName,
                "wallet_balance": 0,
                "total_asset_balance": 0,
                "total_debt_balance": 0,
                "creation_date": new Date().toISOString(),
                "updated_date": new Date().toISOString()
            }
        };
    }
}