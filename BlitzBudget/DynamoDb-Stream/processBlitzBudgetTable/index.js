console.log('Loading function');
let categoryTotal = {};
let accountBalance = {};
let walletBalance = {};

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    for (const record of event.Records) {
        console.log(record.eventID);
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);
        processEntries(record);
    }
    
    batchWriteItems();
    return `Successfully processed ${event.Records.length} records.`;
};

function batchWriteItems() {
    if(isEmpty(categoryTotal) && isEmpty(accountBalance) && isEmpty(walletBalance)) {
        return;
    }
    
    if(isNotEmpty(categoryTotal)) {
        //TODO
    }
    
    if(isNotEmpty(accountBalance)) {
        //TODO
    }
    
    if(isNotEmpty(walletBalance)) {
        //TODO
    }
}


function processEntries(record) {
    let sortKey = record.dynamodb.Keys.sk.S;
    let pk = record.dynamodb.Keys.pk.S;
    let difference = 0;
    
    // If the entries are not transactions / bank accounts then do not process
    if(includesStr(sortKey, 'Transaction')) {
        difference = calculateValueToAdd(record, 'amount');
        updateCategoryTotal(pk, difference);
        updateAccountBalance(pk, difference);
    } else if(includesStr(sortKey, 'BankAccount')) {
        difference = calculateValueToAdd(record, 'account_balance');
        updateWalletBalance(pk, difference);
    }
}

function updateWalletBalance(pk, difference) {
    //if the list is already created for the "key", then uses it
    //else creates new list for the "key" to store multiple values in it.
    walletBalance[pk] = walletBalance[pk] || [];
    
    if(isNotEmpty(walletBalance[pk])) {
        let differenceAlreadyPresent = walletBalance[pk];
        walletBalance[pk].push((differenceAlreadyPresent + difference));
    } else {
        walletBalance[pk].push(difference);   
    }
}

function updateAccountBalance(pk, difference) {
    //if the list is already created for the "key", then uses it
    //else creates new list for the "key" to store multiple values in it.
    accountBalance[pk] = accountBalance[pk] || [];
    
    if(isNotEmpty(accountBalance[pk])) {
        let differenceAlreadyPresent = accountBalance[pk];
        accountBalance[pk].push((differenceAlreadyPresent + difference));
    } else {
        accountBalance[pk].push(difference);   
    }
}

function updateCategoryTotal(pk, difference) {
    //if the list is already created for the "key", then uses it
    //else creates new list for the "key" to store multiple values in it.
    categoryTotal[pk] = categoryTotal[pk] || [];
    
    if(isNotEmpty(categoryTotal[pk])) {
        let differenceAlreadyPresent = categoryTotal[pk];
        categoryTotal[pk].push((differenceAlreadyPresent + difference));
    } else {
        categoryTotal[pk].push(difference);   
    }
}

function calculateValueToAdd(record, attributeName) {
    if(isEqual(record.eventName, 'INSERT')) {
        return parseInt(record.dynamodb.NewImage[attributeName].N);
    } else if(isEqual(record.eventName, 'REMOVE')) {
        return (parseInt(record.dynamodb.OldImage[attributeName].N) * -1);
    } else if(isEqual(record.eventName, 'MODIFY')) {
        return parseInt(record.dynamodb.NewImage[attributeName].N) + (parseInt(record.dynamodb.OldImage[attributeName].N) * -1);
    }
}

function  isEmpty(obj) {
    // Check if objext is a number or a boolean
    if(typeof(obj) == 'number' || typeof(obj) == 'boolean') return false; 
    
    // Check if obj is null or undefined
    if (obj == null || obj === undefined) return true;
    
    // Check if the length of the obj is defined
    if(typeof(obj.length) != 'undefined') return obj.length == 0;
     
    // check if obj is a custom obj
    for(let key in obj) {
        if(obj.hasOwnProperty(key))return false;
    }

    return true;
}

function includesStr(arr, val){
    return isEmpty(arr) ? null : arr.includes(val); 
}

function isEqual(obj1,obj2){
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true;
    }
    return false;
}

function  isNotEmpty(obj) {
    return !isEmpty(obj);
}