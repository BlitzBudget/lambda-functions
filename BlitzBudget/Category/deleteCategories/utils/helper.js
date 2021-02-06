var helper = function () { };

// Splits array into chunks
helper.prototype.chunkArrayInGroups = (arr, size) => {
    var myArray = [];
    for (var i = 0; i < arr.length; i += size) {
        myArray.push(arr.slice(i, i + size));
    }
    return myArray;
}

helper.prototype.isEqual = (obj1, obj2) => {
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true;
    }
    return false;
}

helper.prototype.extractVariablesFromRequest = (event) => {
    let walletId = event['body-json'].walletId;
    let curentPeriod = event['body-json'].category.substring(9, 16);
    return { walletId, curentPeriod };
}

// Export object
module.exports = new helper();