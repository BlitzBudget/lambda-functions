
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

/*
* If Account, Category, Amount or Date is empty
*/
function throwErrorIfEmpty(event, walletId) {
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
}
