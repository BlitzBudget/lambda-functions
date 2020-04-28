console.log('Loading function');
let categoryTotal = {};
let accountBalance = {};
let walletBalance = {};
let sortKeyAndPartitionKey = {};

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
        updateAllBudgetBalance();
    }
    
    if(isNotEmpty(accountBalance)) {
        updateAllAccountBalance();
    }
    
    if(isNotEmpty(walletBalance)) {
        updateAllWalletBalance();
    }
}

function updateAllWalletBalance() {
    let paramToGet = batchGetItemParam(accountBalance);
}

function updateAllAccountBalance() {
    let paramToGet = batchGetItemParam(walletBalance);
}

function updateAllBudgetBalance() {
    let paramForGet = batchGetItemParam(categoryTotal);
}

function batchGetItemParam(map) {
    const params = {
      RequestItems: {
          blitzbudget: {
          }
      },
    };
    
    let budgetBatchWriteMap = [];
    Object.keys(map).forEach(function(sk) {
        let pk = sortKeyAndPartitionKey[sk];
        budgetBatchWriteMap.push({
            "pk" : pk,
            "sk" : sk,
        });
    });
    
    // Prepare Batch Get
    params.RequestItems.blitzbudget.Keys = budgetBatchWriteMap;
}

function processEntries(record) {
    let sortKey = record.dynamodb.Keys.sk.S;
    let difference = 0;
    
    // If the entries are not transactions / bank accounts then do not process
    if(includesStr(sortKey, 'Transaction')) {
        difference = calculateValueToAdd(record, 'amount');
        updateCategoryTotal(sortKey, difference);
        updateAccountBalance(sortKey, difference);
        updateSkAndPkRelationship(sortKey, record.dynamodb.Keys.pk.S);
    } else if(includesStr(sortKey, 'BankAccount')) {
        difference = calculateValueToAdd(record, 'account_balance');
        updateWalletBalance(sortKey, difference);
        updateSkAndPkRelationship(sortKey, record.dynamodb.Keys.pk.S);
    }
}

function updateSkAndPkRelationship(sk , pk) {
    //if the list is already created for the "key", then uses it
    //else creates new list for the "key" to store multiple values in it.
    walletBalance[sk] = walletBalance[sk] || [];
    sortKeyAndPartitionKey[sk].push(pk);
}

function updateWalletBalance(sortKey, difference) {
    //if the list is already created for the "key", then uses it
    //else creates new list for the "key" to store multiple values in it.
    walletBalance[sortKey] = walletBalance[sortKey] || [];
    
    if(isNotEmpty(walletBalance[sortKey])) {
        let differenceAlreadyPresent = walletBalance[sortKey];
        walletBalance[sortKey].push((differenceAlreadyPresent + difference));
    } else {
        walletBalance[sortKey].push(difference);   
    }
}

function updateAccountBalance(sortKey, difference) {
    //if the list is already created for the "key", then uses it
    //else creates new list for the "key" to store multiple values in it.
    accountBalance[sortKey] = accountBalance[sortKey] || [];
    
    if(isNotEmpty(accountBalance[sortKey])) {
        let differenceAlreadyPresent = accountBalance[sortKey];
        accountBalance[sortKey].push((differenceAlreadyPresent + difference));
    } else {
        accountBalance[sortKey].push(difference);   
    }
}

function updateCategoryTotal(sortKey, difference) {
    //if the list is already created for the "key", then uses it
    //else creates new list for the "key" to store multiple values in it.
    categoryTotal[sortKey] = categoryTotal[sortKey] || [];
    
    if(isNotEmpty(categoryTotal[sortKey])) {
        let differenceAlreadyPresent = categoryTotal[sortKey];
        categoryTotal[sortKey].push((differenceAlreadyPresent + difference));
    } else {
        categoryTotal[sortKey].push(difference);   
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