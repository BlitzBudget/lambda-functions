// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();
let nextSchArray = [];
let events = [];
let params = {};

exports.handler = async (event) => {
    params = {};
    params.RequestItems = {};
    params.RequestItems.blitzbudget = [];
    nextSchArray = []; 
    events = [];
    let walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
    let recurringTransactionsId = event.Records[0].Sns.Message;
    console.log( 'Creating transactions via recurring transactions for the walletId ' + walletId);
    buildParamsForPut(event);
    console.log(" The number of transactions to create are %j", params.RequestItems.blitzbudget.length);
    console.log(" The dates to create are %j", nextSchArray.toString());
    
    /*
    * Fetch available dates
    */
    fetchDatesForWallet(walletId);
    
    /*
    * Publish events to get date data
    */
    await Promise.all(events).then(function(result) {
      console.log("Successfully fetched all the relevant information %j", JSON.stringify(result));
      
         for(const dateObj of result) {
              if(includesStr(nextSchArray, dateObj.dateToCreate)) {
                let dateToCreate = new Date();
                dateToCreate.setFullYear(dateObj.dateToCreate.substring(0,4));
                dateToCreate.setMonth(dateObj.dateToCreate.substring(5,7));
                let sk = "Date#" + dateToCreate.toISOString();
                let length = params.RequestItems.blitzbudget.length;
                buildParamsForDate(walletId, sk, length);   
              }
          }   
    }, function(err) {
       throw new Error("Unable error occured while fetching the Budget " + err);
    });
    
    console.log(" The number of transactions and dates to create are %j", params.RequestItems.blitzbudget.length);

};

/*
* Build params for date
*/
function buildParamsForDate(walletId, sk, length) {
    console.log(" Creating the date wrapper for %j", sk);
    params.RequestItems.blitzbudget[length] = { 
        "PutRequest": { 
           "Item": {
               "pk": walletId,
               "sk": sk,
               "income_total": 0,
               "expense_total": 0,
               "balance": 0,
               "creation_date": new Date().toISOString(),
               "updated_date": new Date().toISOString()
           }
        }
    }
}

function fetchDatesForWallet(walletId) {
    for(const dateMeantFor of nextSchArray) {
        events.push(getDateData(walletId, dateMeantFor));
    }
}

/*
* Get Date Data
*/
function getDateData(pk, today) {
  var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :pk AND begins_with(sk, :items)",
      ExpressionAttributeValues: {
          ":pk": pk,
          ":items": "Date#" + today.substring(0,4) + '-' + today.substring(5,7)
      },
      ProjectionExpression: "pk, sk"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        DB.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved - Date %j", data.Count, " for the date ", today);
            if(data.Count != 0) {
                resolve({ "Date" : data.Items});
            }
            resolve({ "dateToCreate" : today});
          }
        });
    });
}


/*
* Build params for put items (transactions)
*/
function buildParamsForPut(event) {
    
    if(isEmpty(event.Records[0])){
        return;
    }
    
    let nextScheduled = event.Records[0].Sns.MessageAttributes["next_scheduled"].Value;
    let recurrence = event.Records[0].Sns.MessageAttributes.recurrence.Value;
    let walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
    let amount = event.Records[0].Sns.MessageAttributes.amount.Value;
    let description = event.Records[0].Sns.MessageAttributes.description.Value;
    let category = event.Records[0].Sns.MessageAttributes.category.Value;
    let account = event.Records[0].Sns.MessageAttributes.account.Value;
    
    
    let nextScheduledDate = new Date(nextScheduled);
    let today =  new Date();
    let i = 0;
    
    while (nextScheduledDate < today) {
        console.log("The scheduled date is %j", nextScheduledDate);
        switch(recurrence) {
           case 'MONTHLY':
            nextScheduledDate.setMonth(nextScheduledDate.getMonth() + 1);
            break;
          case 'WEEKLY':
            nextScheduledDate.setDate(nextScheduledDate.getDate() + 7);
            break;
          case 'BI-MONTHLY':
            nextScheduledDate.setDate(nextScheduledDate.getDate() + 15);
            break;
        }
        
        /*
        * Scheduled Transactions
        */
        let nextScheduledDateAsString = nextScheduledDate.getFullYear() + '-' + ('0' + (nextScheduledDate.getMonth() + 1)).slice(-2);
        if(notIncludesStr(nextSchArray, nextScheduledDateAsString)) {
            nextSchArray.push(nextScheduledDateAsString);   
        }
        
        let sk = "Transaction#" + today.toISOString();
        params.RequestItems.blitzbudget[i] = { 
            "PutRequest": { 
               "Item": {
                   "pk": walletId,
                   "sk": sk,
                   "recurrence": recurrence,
                   "amount": amount,
                   "description": description,
                   "category": category,
                   "account": account,
                   "date_meant_for": 1,
                   "creation_date": new Date().toISOString(),
                   "updated_date": new Date().toISOString()
               }
            }
        };
        // Update counter
        i++;
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

function notIncludesStr(arr, val){
  return !includesStr(arr, val); 
}