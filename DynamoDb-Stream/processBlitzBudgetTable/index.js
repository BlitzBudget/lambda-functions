console.log('Loading function');
let events = [];

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'eu-west-1'
});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    events = [];

    console.log('Received event:', JSON.stringify(event, null, 2));
    for (const record of event.Records) {
        try {
            let sortKey = record.dynamodb.Keys.sk.S;
            console.log("Started processing the event with the sort key %j", sortKey);
            console.log("Started processing the event with id %j", record.eventID);
            console.log("The event name is %j", record.eventName);

            // If the entries are not transactions / bank accounts then do not process
            if (includesStr(sortKey, 'Transaction#')) {
                console.log("Updating the category total and account balance");
                updateCategoryTotal(record);
                updateAccountBalance(record);
            } else if (includesStr(sortKey, 'BankAccount#')) {
                console.log("Updating the wallet account balance");
                updateWalletBalance(record);
            } else if (includesStr(sortKey, 'Wallet#') && isEqual(record.eventName, 'INSERT')) {
                console.log("Adding a new bank account for the newly created wallet");
                events.push(addNewBankAccount(record));
            } else if (includesStr(sortKey, 'Category#')) {
                console.log("Updating the date wrapper with the total");
                updateDateTotal(record);
            }
        } catch (ex) {
            console.log("Could not complete operation", ex);
            console.log("The record that could not be process is %j", JSON.stringify(record));
            continue;
        }
    }

    try {
        await Promise.all(events);
    } catch (ex) {
        console.log("Could not complete operation ", ex);
    }

    return `Successfully processed ${event.Records.length} records.`;
};

function updateDateTotal(record) {
    let pk = record.dynamodb.Keys.pk.S,
        balance = 0,
        date, categoryType, income = 0,
        expense = 0;
    console.log("event is %j", record.eventName);
    if (isEqual(record.eventName, 'INSERT')) {
        return;
    } else if (isEqual(record.eventName, 'REMOVE')) {
        balance = parseFloat(record.dynamodb.OldImage['category_total'].N) * -1;
        categoryType = record.dynamodb.OldImage['category_type'].S;
        date = record.dynamodb.OldImage['date_meant_for'].S;
    } else if (isEqual(record.eventName, 'MODIFY')) {
        balance = parseFloat(record.dynamodb.NewImage['category_total'].N) + (parseFloat(record.dynamodb.OldImage['category_total'].N) * -1);
        categoryType = record.dynamodb.NewImage['category_type'].S;
        date = record.dynamodb.NewImage['date_meant_for'].S;
    }

    console.log("adding the difference %j", balance, "to the date %j", date);

    // if balance is 0 then do nothing
    if (balance == 0) {
        return;
    }

    if (isEqual(categoryType, "Expense")) {
        expense = balance;
    } else if (isEqual(categoryType, "Income")) {
        income = balance;
    }

    events.push(updateDateItem(pk, date, balance, income, expense));
}

function updateDateItem(pk, sk, difference, income, expense) {
    let params = {
        TableName: 'blitzbudget',
        Key: {
            "pk": pk,
            "sk": sk
        },
        UpdateExpression: "set balance = balance + :ab, income_total = income_total + :it, expense_total = expense_total + :et",
        ConditionExpression: 'attribute_exists(balance)',
        ExpressionAttributeValues: {
            ":ab": difference,
            ":it": income,
            ":et": expense
        },
        ReturnValues: "NONE"
    };

    console.log("Updating the item...");
    return new Promise((resolve, reject) => {
        docClient.update(params, function (err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                resolve(data);
            }
        });
    });
}

function updateCategoryTotal(record) {
    let pk = record.dynamodb.Keys.pk.S,
        balance = 0,
        category;
    console.log("event is %j", record.eventName);
    if (isEqual(record.eventName, 'INSERT')) {
        balance = parseFloat(record.dynamodb.NewImage.amount.N);
        category = record.dynamodb.NewImage.category.S;
    } else if (isEqual(record.eventName, 'REMOVE')) {
        balance = parseFloat(record.dynamodb.OldImage.amount.N) * -1;
        category = record.dynamodb.OldImage.category.S;
    } else if (isEqual(record.eventName, 'MODIFY')) {
        // If the balance has changed
        balance = parseFloat(record.dynamodb.NewImage.amount.N) + (parseFloat(record.dynamodb.OldImage.amount.N) * -1);
        category = record.dynamodb.NewImage.category.S;
        // If the category has changed
        if (isNotEqual(category, record.dynamodb.OldImage.category.S)) {
            // The old balance is deducted from the old category
            balance = (parseFloat(record.dynamodb.OldImage.amount.N) * -1);
            category = record.dynamodb.OldImage.category.S;
            // Event is pushed to the array
            console.log("adding the difference %j", balance, "to the category %j", category);
            events.push(updateCategoryItem(pk, category, balance));
            // The new balance is added to the new category
            balance = parseFloat(record.dynamodb.NewImage.amount.N);
            category = record.dynamodb.NewImage.category.S;
        }
    }

    console.log("adding the difference %j", balance, "to the category %j", category);

    // if balance is 0 then do nothing
    if (balance == 0) {
        return;
    }

    events.push(updateCategoryItem(pk, category, balance));
}

function updateCategoryItem(pk, sk, difference) {
    let params = {
        TableName: 'blitzbudget',
        Key: {
            "pk": pk,
            "sk": sk
        },
        UpdateExpression: "set category_total = category_total + :ab",
        ConditionExpression: 'attribute_exists(category_total)',
        ExpressionAttributeValues: {
            ":ab": difference,
        },
        ReturnValues: "NONE"
    };

    console.log("Updating the item...");
    return new Promise((resolve, reject) => {
        docClient.update(params, function (err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                resolve(data);
            }
        });
    });
}

function addNewBankAccount(record) {
    let today = new Date();
    let randomValue = "BankAccount#" + today.toISOString();

    var params = {
        TableName: 'blitzbudget',
        Item: {
            "pk": record.dynamodb.Keys.sk.S,
            "sk": randomValue,
            "account_type": 'ASSET',
            "account__sub_type": 'Cash',
            "bank_account_name": 'Cash',
            "linked": false,
            "account_balance": 0,
            "selected_account": true,
            "primary_wallet": record.dynamodb.Keys.pk.S,
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
            }
        });
    });

}

function updateWalletBalance(record) {
    let pk = record.dynamodb.Keys.pk.S,
        balance = 0,
        primaryWalletId, accountType, assetBalance = 0,
        debtBalance = 0;

    console.log("event is %j for updating the wallet balance", JSON.stringify(record.dynamodb));

    if (isEqual(record.eventName, 'INSERT')) {
        balance = parseFloat(record.dynamodb.NewImage['account_balance'].N);
        primaryWalletId = record.dynamodb.NewImage['primary_wallet'].S;
        accountType = record.dynamodb.NewImage['account_type'].S;
    } else if (isEqual(record.eventName, 'REMOVE')) {
        balance = parseFloat(record.dynamodb.OldImage['account_balance'].N) * -1;
        primaryWalletId = record.dynamodb.OldImage['primary_wallet'].S;
        accountType = record.dynamodb.OldImage['account_type'].S;
    } else if (isEqual(record.eventName, 'MODIFY')) {
        balance = parseFloat(record.dynamodb.NewImage['account_balance'].N) + (parseFloat(record.dynamodb.OldImage['account_balance'].N) * -1);
        primaryWalletId = record.dynamodb.NewImage['primary_wallet'].S;
        accountType = record.dynamodb.NewImage['account_type'].S;
    }

    console.log("Adding the difference %j to the wallet", balance);

    // if balance is 0 then do nothing
    if (balance == 0) {
        return;
    }

    if (isEqual(accountType, "ASSET")) {
        assetBalance = balance;
    } else if (isEqual(accountType, "DEBT")) {
        debtBalance = balance;
    }

    events.push(updateWalletBalanceItem(primaryWalletId, pk, balance, assetBalance, debtBalance));
}

function updateWalletBalanceItem(pk, sk, balance, assetBalance, debtBalance) {
    let params = {
        TableName: 'blitzbudget',
        Key: {
            "pk": pk,
            "sk": sk
        },
        UpdateExpression: "set wallet_balance = wallet_balance + :ab, total_asset_balance = total_asset_balance + :tab, total_debt_balance = total_debt_balance + :dab",
        ConditionExpression: 'attribute_exists(wallet_balance)',
        ExpressionAttributeValues: {
            ":ab": balance,
            ":tab": assetBalance,
            ":dab": debtBalance,
        },
        ReturnValues: "NONE"
    };

    console.log("Updating the item...");
    return new Promise((resolve, reject) => {
        docClient.update(params, function (err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                resolve(data);
            }
        });
    });
}

function updateAccountBalance(record) {
    let pk = record.dynamodb.Keys.pk.S,
        balance = 0,
        account;
    console.log("event is %j", record.eventName);
    if (isEqual(record.eventName, 'INSERT')) {
        balance = parseFloat(record.dynamodb.NewImage.amount.N);
        account = record.dynamodb.NewImage.account.S;
    } else if (isEqual(record.eventName, 'REMOVE')) {
        balance = parseFloat(record.dynamodb.OldImage.amount.N) * -1;
        account = record.dynamodb.OldImage.account.S;
    } else if (isEqual(record.eventName, 'MODIFY')) {
        balance = parseFloat(record.dynamodb.NewImage.amount.N) + (parseFloat(record.dynamodb.OldImage.amount.N) * -1);
        account = record.dynamodb.NewImage.account.S;
        let oldAccount = record.dynamodb.OldImage.account.S;
        if (isNotEqual(account, oldAccount)) {
            let oldBalance = (parseFloat(record.dynamodb.OldImage.amount.N) * -1);
            let newBalance = parseFloat(record.dynamodb.NewImage.amount.N);
            events.push(updateAccountBalanceItem(pk, account, newBalance));
            events.push(updateAccountBalanceItem(pk, oldAccount, oldBalance));
            return;
        }
    }

    console.log("adding the difference %j", balance, "to the account %j", account);

    // if balance is 0 then do nothing
    if (balance == 0) {
        return;
    }

    events.push(updateAccountBalanceItem(pk, account, balance));
}

function updateAccountBalanceItem(pk, sk, balance) {
    console.log("Updating account balance for the account with walelt Id %j", pk, " With sk as ", sk, " with the balance ", balance);
    let params = {
        TableName: 'blitzbudget',
        Key: {
            "pk": pk,
            "sk": sk
        },
        UpdateExpression: "set account_balance = account_balance + :ab",
        ConditionExpression: 'attribute_exists(account_balance)',
        ExpressionAttributeValues: {
            ":ab": balance,
        },
        ReturnValues: "UPDATED_NEW"
    };

    console.log("Updating the item...");
    return new Promise((resolve, reject) => {
        docClient.update(params, function (err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                resolve(data);
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

function includesStr(arr, val) {
    return isEmpty(arr) ? null : arr.includes(val);
}

function isEqual(obj1, obj2) {
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true;
    }
    return false;
}

function isNotEqual(obj1, obj2) {
    return !isEqual(obj1, obj2);
}
