var helper = function () { };

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


function extractVariablesFromRequest(event) {
    let userId = event['body-json'].userId;
    let currency = event['body-json'].currency;
    let walletName = event['body-json']['walletName'];
    return { userId, currency, walletName };
}

helper.prototype.isEmpty = isEmpty;
helper.prototype.isNotEmpty = isNotEmpty;
helper.prototype.extractVariablesFromRequest = extractVariablesFromRequest;
// Export object
module.exports = new helper(); 