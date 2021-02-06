
// Splits array into chunks
function chunkArrayInGroups(arr, size) {
    var myArray = [];
    for (var i = 0; i < arr.length; i += size) {
        myArray.push(arr.slice(i, i + size));
    }
    return myArray;
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

function notIncludesStr(arr, val) {
    return !includesStr(arr, val);
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

function isNotEqual(obj1, obj2) {
    return !isEqual(obj1, obj2);
}

function extractVariablesFromRequest(event) {
    let walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
    let category = event.Records[0].Sns.MessageAttributes.category.Value;
    let categoryType = event.Records[0].Sns.MessageAttributes.categoryType.Value;
    let categoryName = event.Records[0].Sns.MessageAttributes.categoryName.Value;
    let recurringTransactionsId = event.Records[0].Sns.Message;
    console.log('Creating transactions via recurring transactions for the walletId ' + walletId);
    return { walletId, category, categoryType, categoryName, recurringTransactionsId };
}