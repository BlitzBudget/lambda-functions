console.log('Loading function');
let categoryTotal = {};
let accountBalance = {};
let pkToaccountSK = {};
let walletBalance = {};
let events = [];

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    for (const record of event.Records) {
        console.log(record.eventID);
        console.log(record.eventName);
        let sortKey = record.dynamodb.Keys.sk.S;
    
        // If the entries are not transactions / bank accounts then do not process
        if(includesStr(sortKey, 'Transaction')) {
            //updateCategoryTotal(record);
            updateAccountBalance(record);
        } else if(includesStr(sortKey, 'BankAccount')) {
            updateWalletBalance(record);
        } else if(includesStr(sortKey, 'Wallet') && isEqual(record.eventName, 'INSERT')) {
            events.push(addNewBankAccount(record));
        }
    }
    
    await Promise.all(events);
    return `Successfully processed ${event.Records.length} records.`;
};

function addNewBankAccount(record) {
    let today = new Date();
    let randomValue = "BankAccount#" + today.toISOString(); 
        
    var params = {
      TableName:'blitzbudget',
      Item:{
            "pk": record.dynamodb.Keys.pk.S,
            "sk": randomValue,
            "account_type": 'ASSET',
            "bank_account_name": 'Cash',
            "linked": false,
            "account_balance": 0,
            "selected_account": true,
      }
    };
    
    console.log("Adding a new item...");
    return new Promise((resolve, reject) => {
      docClient.put(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            resolve({ "success" : data});
            event['body-json'].id= randomValue;
          }
      });
    });
    
}

function updateWalletBalance(record) {
    let pk = record.dynamodb.Keys.pk.S, balance = 0;
    
    console.log("event is %j for updating the wallet balance", record.eventName);
    
    if(isEqual(record.eventName, 'INSERT')) {
        balance = parseInt(record.dynamodb.NewImage['account_balance'].N);
    } else if(isEqual(record.eventName, 'REMOVE')) {
        balance = parseInt(record.dynamodb.OldImage['account_balance'].N) * -1;
    } else if(isEqual(record.eventName, 'MODIFY')) {
        balance = parseInt(record.dynamodb.NewImage['account_balance'].N) + (parseInt(record.dynamodb.OldImage['account_balance'].N) * -1);
    }
    
    console.log("Adding the difference %j to the wallet", balance);
    
    // if balance is 0 then do nothing
    if(balance == 0) {
        return;
    }
    
    
    events.push(updateWalletBalanceThroughSNS(pk, balance));
}

function updateWalletBalanceThroughSNS(pk) {
  
}

function updateAccountBalance(record) {
    let pk = record.dynamodb.Keys.pk.S, balance = 0, account;
    console.log("event is %j", record.eventName);
    if(isEqual(record.eventName, 'INSERT')) {
        balance = parseInt(record.dynamodb.NewImage.amount.N);
        account = record.dynamodb.NewImage.account.S;
    } else if(isEqual(record.eventName, 'REMOVE')) {
        balance = parseInt(record.dynamodb.OldImage.amount.N) * -1;
        account = record.dynamodb.OldImage.account.S;
    } else if(isEqual(record.eventName, 'MODIFY')) {
        balance = parseInt(record.dynamodb.NewImage.amount.N) + (parseInt(record.dynamodb.OldImage.amount.N) * -1);
        account = record.dynamodb.NewImage.account.S;
        let oldAccount = record.dynamodb.OldImage.account.S;   
        if(isNotEqual(account, oldAccount)) {
            let oldBalance = (parseInt(record.dynamodb.OldImage.amount.N) * -1);
            let newBalance = parseInt(record.dynamodb.NewImage.amount.N);
            events.push(updateAccountBalanceItem(pk, account, newBalance));
            events.push(updateAccountBalanceItem(pk, oldAccount, oldBalance));
            return;
        }
    }
    
    console.log("adding the difference %j", balance, "to the account %j", account);
    
    // if balance is 0 then do nothing
    if(balance == 0) {
        return;
    }
    
    events.push(updateAccountBalanceItem(pk, account, balance));
}

function updateAccountBalanceItem(pk, sk, balance) {
    let params = {
        TableName: 'blitzbudget',
        Key:{
            "pk": pk,
            "sk": sk
        },
        UpdateExpression: "set account_balance = account_balance + :ab",
        ExpressionAttributeValues:{
            ":ab": balance,
        },
        ReturnValues:"UPDATED_NEW"
    };
    
    console.log("Updating the item...");
    return new Promise((resolve, reject) => {
        docClient.update(params, function(err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                resolve(data);
            }
        });
    });
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

function isNotEqual(obj1, obj2) {
	return !isEqual(obj1, obj2);
}

function isNotEmpty(obj) {
    return !isEmpty(obj);
}