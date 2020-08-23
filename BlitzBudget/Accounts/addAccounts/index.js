// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'eu-west-1'
});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("adding BankAccounts for ", JSON.stringify(event['body-json']));
    let walletId = event['body-json'].primaryWallet;

    /*
     * If accountType, bankAccountName, accountBalance or selectedAccount is empty
     */
    if (isEmpty(event['body-json'].accountType)) {
        console.log("The account type is mandatory for adding an account %j", walletId);
        throw new Error("Unable to add the transaction as bank account type is mandatory");
    } else if (isEmpty(event['body-json'].bankAccountName)) {
        console.log("The bank account name is mandatory for adding an account %j", walletId);
        throw new Error("Unable to add the transaction as bank account name is mandatory");
    } else if (isEmpty(event['body-json'].accountBalance)) {
        console.log("The account balance is mandatory for adding an account %j", walletId);
        throw new Error("Unable to add the transaction as account balance is mandatory");
    } else if (isEmpty(event['body-json'].selectedAccount)) {
        console.log("The selected account is mandatory for adding an account %j", walletId);
        throw new Error("Unable to add the transaction as selected account is mandatory");
    }

    await addNewBankAccounts(event).then(function (result) {
        console.log("successfully saved the new BankAccounts");
    }, function (err) {
        throw new Error("Unable to add the BankAccounts " + err);
    });

    return event;
};

function addNewBankAccounts(event) {
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

function isEmpty(obj) {
    // Check if objext is a number or a boolean
    if (typeof (obj) == 'number' || typeof (obj) == 'boolean') return false;

    // Check if obj is null or undefined
    if (obj == null || obj === undefined) return true;

    // Check if the length of the obj is defined
    if (typeof (obj.length) != 'undefined') return obj.length == 0;

    // check if obj is a custom obj
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) return false;
    }

    return true;
}
