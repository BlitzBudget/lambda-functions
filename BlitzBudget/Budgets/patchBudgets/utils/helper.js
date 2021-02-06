var helper = function () { };

function isNotEmpty(obj) {
    return !isEmpty(obj);
}

function includesStr(arr, val) {
    return isEmpty(arr) ? null : arr.includes(val);
}

function notIncludesStr(arr, val) {
    return !includesStr(arr, val);
}

function isEqual(obj1, obj2) {
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true;
    }
    return false;
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

helper.prototype.isEmpty = isEmpty;
helper.prototype.isNotEmpty = isNotEmpty;
helper.prototype.isEqual = isEqual;
helper.prototype.includesStr = includesStr;
helper.prototype.notIncludesStr = notIncludesStr;

helper.prototype.formulateDateFromRequest = (event) => {
    let today = new Date();
    today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
    today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) - 1);
    return today;
}

// Export object
module.exports = new helper(); 