var helper = function () { };

let extractVariablesFromRequest = (event) => {
    let walletId = event['body-json'].walletId;
    let startsWithDate = event['body-json'].startsWithDate;
    let endsWithDate = event['body-json'].endsWithDate;
    let dateMeantFor = event['body-json'].dateMeantFor;
    return { walletId, dateMeantFor, startsWithDate, endsWithDate };
}

/*
* If dateMeantFor, category, planned is empty
*/
let throwErrorIfEmpty = (event, walletId) => {
    if (isEmpty(event['body-json'].dateMeantFor)) {
        console.log("The date is mandatory for adding an account %j", walletId);
        throw new Error("Unable to add the transaction as date is mandatory");
    } else if (isEmpty(event['body-json'].category)) {
        console.log("The category is mandatory for adding an account %j", walletId);
        throw new Error("Unable to add the transaction as category is mandatory");
    } else if (isEmpty(event['body-json'].planned)) {
        console.log("The planned balance is mandatory for adding an account %j", walletId);
        throw new Error("Unable to add the transaction as planned balance is mandatory");
    }
}

let calculateDateMeantFor = (startsWithDate, endsWithDate, event, dateMeantFor) => {
    if (isNotEmpty(startsWithDate) && isNotEmpty(endsWithDate)) {
        console.log("Start date %j ", startsWithDate, " and end date is ", endsWithDate, " are present.");
        if (isFullMonth(startsWithDate, endsWithDate)) {
            event['body-json'].dateMeantFor = startsWithDate;
        } else if (percentage == 1) {
            throw new Error("Unable to add the Budget, As the start date and end date must be the same month and year.");
        } else {
            event['body-json'].dateMeantFor = startsWithDate;
            dateMeantFor = startsWithDate;
            event['body-json'].planned *= percentage;
            console.log("Changing the date meant for to %j", event['body-json'].dateMeantFor, " and the planned to ", event['body-json'].planned);
        }
    }
    return dateMeantFor;
}

/*
 * Calculate difference between startdate and end date
 */
function isFullMonth(startsWithDate, endsWithDate) {
    startsWithDate = new Date(startsWithDate);
    endsWithDate = new Date(endsWithDate);

    if (isNotEqual(startsWithDate.getMonth(), endsWithDate.getMonth()) || isNotEqual(startsWithDate.getFullYear(), endsWithDate.getFullYear())) {
        console.log("The month and the year do not coincide");
        return false;
    }

    let firstDay = new Date(startsWithDate.getFullYear(), startsWithDate.getMonth());
    let lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

    if (isEqual(firstDay.getDate(), startsWithDate.getDate()) && isEqual(lastDay.getDate(), endsWithDate.getDate())) {
        return true;
    }

    let periodChosen = endsWithDate.getDate() - startsWithDate.getDate();
    /*
     * If the starts date and end date is the same then.
     */
    if (periodChosen == 0) {
        console.log("The start date and the end date mentioned are the same");
        periodChosen = 1;
    }

    // Calculate oercentage only if the start date and end date is the same month and year, Else the percentage will be applied for all months
    percentage = lastDay.getDate() / periodChosen;
    console.log("Percentage of budget total to be calculated is %j", percentage);
    return false;
}

function includesStr(arr, val) {
    return isEmpty(arr) ? null : arr.includes(val);
}

function notIncludesStr(arr, val) {
    return !includesStr(arr, val);
}

let isEmpty = (obj) => {
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

let isNotEmpty = (obj) => {
    return !isEmpty(obj);
}

let isEqual = (obj1, obj2) => {
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true;
    }
    return false;
}

let isNotEqual = (obj1, obj2) => {
    return !isEqual(obj1, obj2);
}

helper.prototype.isEmpty = isEmpty;
helper.prototype.isNotEmpty = isNotEmpty;
helper.prototype.isEqual = isEqual;
helper.prototype.isNotEqual = isNotEqual;
helper.prototype.notIncludesStr = notIncludesStr;
helper.prototype.calculateDateMeantFor = calculateDateMeantFor;
helper.prototype.throwErrorIfEmpty = throwErrorIfEmpty;
helper.prototype.extractVariablesFromRequest = extractVariablesFromRequest;

helper.prototype.convertToDate = (event) => {
    let today = new Date();
    today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
    today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) - 1);
    return today;
}

// Export object
module.exports = new helper();