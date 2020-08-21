// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'eu-west-1'
});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("adding transactions for ", JSON.stringify(event['body-json']));
    let events = [];
    let walletId = event['body-json'].walletId;

    /*
     * If Account, Category, Amount or Date is empty
     */
    if (isEmpty(event['body-json'].account)) {
        console.log("The bank account is mandatory for adding a transaction %j", walletId);
        throw new Error("Unable to add the transaction as bank account is mandatory");
    } else if (isEmpty(event['body-json'].category)) {
        console.log("The category is mandatory for adding a transaction %j", walletId);
        throw new Error("Unable to add the transaction as category is mandatory");
    } else if (isEmpty(event['body-json'].amount)) {
        console.log("The amount is mandatory for adding a transaction %j", walletId);
        throw new Error("Unable to add the transaction as amount is mandatory");
    } else if (isEmpty(event['body-json'].dateMeantFor)) {
        console.log("The date is mandatory for adding a transaction %j", walletId);
        throw new Error("Unable to add the transaction as date is mandatory");
    }

    /*
     * If Date Id is not present
     */
    let dateMeantFor = event['body-json'].dateMeantFor;
    if (notIncludesStr(dateMeantFor, 'Date#')) {
        let today = new Date(event['body-json'].dateMeantFor);
        /*
         * Check if date is present before adding them
         */
        await getDateData(walletId, today).then(function (result) {
            if (isNotEmpty(result.Date)) {
                console.log("successfully assigned the exissting date %j", result.Date[0].sk);
                dateMeantFor = result.Date[0].sk;
            } else {
                dateMeantFor = "Date#" + today.toISOString();
                console.log("Date entry is empty so creating the date object");
                events.push(createDateData(event, dateMeantFor));
            }
            // Assign Date meant for to create the transactions with the date ID
            event['body-json'].dateMeantFor = dateMeantFor;
        }, function (err) {
            throw new Error("Unable to add the Budget " + err);
        });
    }

    /*
     * If category Id is not present
     */
    let categoryName = event['body-json'].category;
    if (isNotEmpty(categoryName) && notIncludesStr(categoryName, 'Category#')) {
        let today = new Date();
        today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
        today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) - 1);
        let categoryId = "Category#" + today.toISOString();

        /*
         * Check if category is present before adding them
         */
        await getCategoryData(categoryId, event, today).then(function (result) {
            if (isNotEmpty(result.Category)) {
                console.log("successfully assigned the existing category %j", result.Category.sk);
                event['body-json'].category = result.Category.sk;
            } else {
                // Assign Category to create the transactions with the category ID
                event['body-json'].category = categoryId;
                event['body-json'].categoryName = categoryName;
                events.push(createCategoryItem(event, categoryId, categoryName));
            }
        }, function (err) {
            throw new Error("Unable to get the category " + err);
        });
    }

    /*
     * Add a new recurring transaction if recurrence is required
     */
    if (isNotEmpty(event['body-json'].recurrence) && event['body-json'].recurrence != 'NEVER') {
        events.push(addNewRecurringTransaction(event));
    }
    events.push(addNewTransaction(event));
    await Promise.all(events).then(function (result) {
        console.log("successfully saved the new transaction");
    }, function (err) {
        throw new Error("Unable to add the transactions " + err);
    });

    return event;
};

function getCategoryData(categoryId, event, today) {
    var params = {
        TableName: 'blitzbudget',
        KeyConditionExpression: "pk = :pk AND begins_with(sk, :items)",
        ExpressionAttributeValues: {
            ":pk": event['body-json'].walletId,
            ":items": "Category#" + today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2)
        },
        ProjectionExpression: "pk, sk, category_name, category_type"
    };

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("data retrieved - Category %j", data.Count);
                let obj;
                if (isNotEmpty(data.Items)) {
                    for (const categoryObj of data.Items) {
                        if (isEqual(categoryObj['category_type'], event['body-json'].categoryType) &&
                            isEqual(categoryObj['category_name'], event['body-json'].category)) {
                            console.log("Found a match for the mentioned category %j", categoryObj.sk);
                            obj = categoryObj;
                        }
                    }
                }

                if (isEmpty(obj)) {
                    console.log("No matching categories found");
                }

                resolve({
                    "Category": obj
                });
            }
        });
    });
}

function getDateData(pk, today) {
    var params = {
        TableName: 'blitzbudget',
        KeyConditionExpression: "pk = :pk AND begins_with(sk, :items)",
        ExpressionAttributeValues: {
            ":pk": pk,
            ":items": "Date#" + today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2)
        },
        ProjectionExpression: "pk, sk"
    };

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("data retrieved - Date %j", JSON.stringify(data.Items));
                resolve({
                    "Date": data.Items
                });
            }
        });
    });
}

function createDateData(event, skForDate) {

    var params = {
        TableName: 'blitzbudget',
        Key: {
            "pk": event['body-json'].walletId,
            "sk": skForDate,
        },
        UpdateExpression: "set income_total = :r, expense_total=:p, balance=:a, creation_date = :c, updated_date = :u",
        ExpressionAttributeValues: {
            ":r": 0,
            ":p": 0,
            ":a": 0,
            ":c": new Date().toISOString(),
            ":u": new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
    }

    console.log("Adding a new item...");
    return new Promise((resolve, reject) => {
        docClient.update(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("successfully created a new date %j", data.Attributes.sk);
                event['body-json'].dateMeantFor = data.Attributes.sk;
                resolve({
                    "Date": data.Attributes
                });
            }
        });
    });

}

function createCategoryItem(event, skForCategory, categoryName) {

    var params = {
        TableName: 'blitzbudget',
        Key: {
            "pk": event['body-json'].walletId,
            "sk": skForCategory,
        },
        UpdateExpression: "set category_total = :r, category_name = :p, category_type = :q, date_meant_for = :s, creation_date = :c, updated_date = :u",
        ExpressionAttributeValues: {
            ":r": 0,
            ":p": categoryName,
            ":q": event['body-json'].categoryType,
            ":s": event['body-json'].dateMeantFor,
            ":c": new Date().toISOString(),
            ":u": new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
    }

    console.log("Adding a new item...");
    return new Promise((resolve, reject) => {
        docClient.update(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("Successfully created a new category %j", data.Attributes.sk)
                event['body-json'].category = data.Attributes.sk;
                resolve({
                    "Category": data.Attributes
                });
            }
        });
    });
}

function addNewTransaction(event) {
    let today = new Date();
    today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
    today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) - 1);
    let randomValue = "Transaction#" + today.toISOString();

    var params = {
        TableName: 'blitzbudget',
        Item: {
            "pk": event['body-json'].walletId,
            "sk": randomValue,
            "amount": event['body-json'].amount,
            "description": event['body-json'].description,
            "category": event['body-json'].category,
            "recurrence": event['body-json'].recurrence,
            "account": event['body-json'].account,
            "date_meant_for": event['body-json'].dateMeantFor,
            "tags": event['body-json'].tags,
            "creation_date": today.toISOString(),
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
                event['body-json'].transactionId = randomValue;
            }
        });
    });

}

function addNewRecurringTransaction(event) {
    let today = new Date();
    today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
    today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) - 1);
    let randomValue = "RecurringTransactions#" + today.toISOString();
    let nextRecurrence = today;

    switch (event['body-json'].recurrence) {
        case 'MONTHLY':
            nextRecurrence.setMonth(nextRecurrence.getMonth() + 1);
            event['body-json'].nextScheduled = nextRecurrence.toISOString();
            break;
        case 'WEEKLY':
            nextRecurrence.setDate(nextRecurrence.getDate() + 7);
            event['body-json'].nextScheduled = nextRecurrence.toISOString();
            break;
        case 'BI-MONTHLY':
            nextRecurrence.setDate(nextRecurrence.getDate() + 15);
            event['body-json'].nextScheduled = nextRecurrence.toISOString();
            break;
    }

    var params = {
        TableName: 'blitzbudget',
        Item: {
            "pk": event['body-json'].walletId,
            "sk": randomValue,
            "amount": event['body-json'].amount,
            "description": event['body-json'].description,
            "category": event['body-json'].category,
            "recurrence": event['body-json'].recurrence,
            "account": event['body-json'].account,
            "tags": event['body-json'].tags,
            "next_scheduled": event['body-json'].nextScheduled,
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
                event['body-json'].id = randomValue;
            }
        });
    });

}

function includesStr(arr, val) {
    return isEmpty(arr) ? null : arr.includes(val);
}

function notIncludesStr(arr, val) {
    return !includesStr(arr, val);
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

function isNotEmpty(obj) {
    return !isEmpty(obj);
}

function isEqual(obj1, obj2) {
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true;
    }
    return false;
}
