// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'eu-west-1'
});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

var addAccount = function () { };

addAccount.prototype.addNewBankAccounts = (event) => {
    let today = new Date();
    let randomValue = "BankAccount#" + today.toISOString();

    var params = {
        TableName: 'blitzbudget',
        Item: {
            "pk": event['body-json'].walletId,
            "sk": randomValue,
            "account_type": event['body-json'].accountType,
            "bank_account_name": event['body-json'].bankAccountName,
            "linked": event['body-json'].linked,
            "account_balance": event['body-json'].accountBalance,
            "account_sub_type": event['body-json'].accountSubType,
            "selected_account": event['body-json'].selectedAccount,
            "primary_wallet": event['body-json'].primaryWallet,
            "creation_date": new Date().toISOString(),
            "updated_date": new Date().toISOString()
        }
    };

    console.log("Adding a new item...");
    return new Promise((resolve, reject) => {
        docClient.put(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                resolve({
                    "success": data
                });
                event['body-json'].accountId = randomValue;
            }
        });
    });
}

module.exports = new addAccount();
