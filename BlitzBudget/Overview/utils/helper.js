var helper = function () { };

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

helper.prototype.isEmpty = isEmpty;

helper.prototype.isNotEmpty = (obj) => {
    return !isEmpty(obj);
}

helper.prototype.extractVariablesFromRequest = (event) => {
    let walletId = event['body-json'].walletId;
    let userId = event['body-json'].userId;
    console.log("fetching item for the walletId %j", event['body-json'].walletId);
    console.log("fetching item with the userId %j", event['body-json'].userId);

    /*
     * Get all dates from one year ago
     */
    let endsWithDate = new Date(event['body-json'].endsWithDate).toISOString();
    let startsWithDate = new Date(event['body-json'].startsWithDate).toISOString();
    let twelveMonthsAgo = new Date(event['body-json'].endsWithDate);
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    twelveMonthsAgo.setDate(1);
    let oneYearAgo = twelveMonthsAgo.toISOString();

    console.log("dateMeantFor %j", oneYearAgo);

    return { oneYearAgo, walletId, userId, startsWithDate, endsWithDate };
}

// Export object
module.exports = new helper(); 