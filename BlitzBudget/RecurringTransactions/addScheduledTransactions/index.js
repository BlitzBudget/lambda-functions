// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();
let nextSchArray = [];
let events = [];
let params = {};
let recurringTransactionsNextSch;

exports.handler = async (event) => {
    params = {};
    params.RequestItems = {};
    params.RequestItems.blitzbudget = [];
    nextSchArray = []; 
    events = [];
    let datesMap = {};
    let categoryMap = {};
    let walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
    let category = event.Records[0].Sns.MessageAttributes.category.Value;
    let recurringTransactionsId = event.Records[0].Sns.Message;
    console.log( 'Creating transactions via recurring transactions for the walletId ' + walletId);
    buildParamsForPut(event);
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
        
        /*
        * Calculate Date
        */
        for(const dateObj of result) {
             
            /*
            * If Date is empty then
            */
            if(includesStr(nextSchArray, dateObj.dateToCreate)) {
                let dateToCreate = new Date();
                dateToCreate.setFullYear(dateObj.dateToCreate.substring(0,4));
                let month = parseInt(dateObj.dateToCreate.substring(5,7)) -1;
                dateToCreate.setMonth(month);
                let sk = "Date#" + dateToCreate.toISOString();
                buildParamsForDate(walletId, sk);
                /*
                * Build date object to place the date in transactions
                */
                dateObj.Date = [];
                dateObj.Date.push({ 'sk': sk});
            }
              
            /*
            * Populate to dates map
            */
            if(dateObj.Date) {
                 datesMap[dateObj.Date[0].sk.substring(5, 12)] = (dateObj.Date[0].sk);   
            }
            
        }
       
    }, function(err) {
       throw new Error("Unable to fetch the date for the recurring transaction" + err);
    });
    
    /*
    * Start processing categories
    */
    let originalCategory;
    await fetchCategoryFromTransaction(walletId, category).then(function(result) {
        originalCategory = result;
    }, function(err) {
       throw new Error("Unable to fetch the date for the recurring transaction" + err);
    });
    
    events = [];
    for(const dateMeantFor of nextSchArray) {
        /*
        * Check if 2020-03 == 2020-02
        */
        if(isNotEqual(dateMeantFor,originalCategory.CategoryToCopy.Item.sk.substring(9,16))) {
            events.push(getCategoryData(walletId, dateMeantFor, originalCategory));
        }
    }
    
    /*
    * Publish events to get category data
    */
    await Promise.all(events).then(function(result) {
        console.log("Processing Categories to create");
        for(const categoryItem of result) {
            categoryMap[categoryItem.dateMeantFor] = categoryItem.sortKey;
            buildParamsForCategory(walletId, categoryItem.sortKey, originalCategory, 1);   
        }
    }, function(err) {
       throw new Error("Unable to fetch the date for the recurring transaction" + err);
    });
    
    console.log(" The number of dates and categories to create are %j", params.RequestItems.blitzbudget.length);
    constructTransactionsWithDateMeantForAndCategory(datesMap, categoryMap, event);
    console.log(" The number of transactions to create are %j", params.RequestItems.blitzbudget.length);

};

function buildParamsForCategory(pk, sk, categoryToCopy, dateMeantFor) {
    let length = params.RequestItems.blitzbudget.length;
    console.log(" Creating the date wrapper for %j", sk);
    params.RequestItems.blitzbudget[length] = { 
        "PutRequest": { 
           "Item": {
               "pk": pk,
               "sk": sk,
               "category_total": 0,
               "category_name": categoryToCopy['category_name'],
               "category_type": categoryToCopy['category_type'], 
               "date_meant_for": dateMeantFor,
               "creation_date": new Date().toISOString(),
               "updated_date": new Date().toISOString()
           }
        }
    }
    console.log("Creating the category with an sk %j", sk, " And with a date as ", dateMeantFor, " for the wallet ", pk);
}

async function call() {
    await batchWriteItems().then(function(result) {
      console.log("Successfully fetched all the relevant information %j", JSON.stringify(result));
    }, function(err) {
       throw new Error("Unable to batch write all the transactions and dates " + err);
    });
    
    await updateRecurringTransactionsData(walletId, recurringTransactionsId).then(function(result) {
      console.log("Successfully updated the recurring transactions field %j", recurringTransactionsNextSch);
    }, function(err) {
       throw new Error("Unable to update the recurring transactions field " + err);
    });
}

/*
* Fetch category
*/
function fetchCategoryFromTransaction(pk, sk) {
    console.log("Fetching the category %j", sk, " with the wallet id as ", pk )
    var params = {
      AttributesToGet: [
        "category_name",
        "category_total", 
        "category_type",
        "pk",
        "sk"
      ],
      TableName: 'blitzbudget',
      Key : { 
        "pk" : pk,
        "sk" : sk
      }
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        DB.get(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved - Category To Copy %j", JSON.stringify(data));
            resolve({ "CategoryToCopy" : data});
          }
        });
    });
}

/*
* Update the recurring transaction
*/ 
function updateRecurringTransactionsData(walletId, sk) {
  
  var params = {
      TableName:'blitzbudget',
      Key:{
        "pk": walletId,
        "sk": sk,
      },
      UpdateExpression: "set next_scheduled = :ns, updated_date = :u",
      ExpressionAttributeValues:{
          ":ns": recurringTransactionsNextSch,
          ":u": new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
  }
  
  console.log("Adding a new item...");
  return new Promise((resolve, reject) => {
    DB.update(params, function(err, data) {
        if (err) {
          console.log("Error ", err);
          reject(err);
        } else {
          console.log("successfully updated the recurring transaction %j", data.Attributes.sk);
          resolve(data.Attributes);
        }
    });
  });
  
}

/*
* Batch write all the transactions and dates created
*/
function batchWriteItems() {
    return new Promise((resolve, reject) => {
        DB.batchWrite(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            resolve({ "success" : data});
          }
        });
    });
}

/*
* Populate the date meant for attribute in the transactions
*/
function constructTransactionsWithDateMeantForAndCategory(datesMap, categoryMap, event) {
    let recurrence = event.Records[0].Sns.MessageAttributes.recurrence.Value;
    let walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
    let amount = parseInt(event.Records[0].Sns.MessageAttributes.amount.Value);
    let description = event.Records[0].Sns.MessageAttributes.description.Value;
    let category = event.Records[0].Sns.MessageAttributes.category.Value;
    let account = event.Records[0].Sns.MessageAttributes.account.Value;
    let i = params.RequestItems.blitzbudget.length;
    let dateMeantFor;
    
    let nextScheduled = event.Records[0].Sns.MessageAttributes["next_scheduled"].Value;
    let nextScheduledDate = new Date(nextScheduled);
    let today =  new Date();
    
    while (nextScheduledDate < today) {
        let sk = "Transaction#" + nextScheduledDate.toISOString();
        
        let compareString = sk.substring(12,19);
        if(isNotEmpty(datesMap[compareString])) {
            console.log("The date for the transaction %j ", sk, " is ", datesMap[compareString]);
            dateMeantFor = datesMap[compareString];
        }
        
        if(isNotEmpty(categoryMap[compareString])) {
            console.log("The category for the transaction %j ", sk, " is ", categoryMap[compareString]);
            category = categoryMap[compareString];
        }
        
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
                   "date_meant_for": dateMeantFor,
                   "creation_date": new Date().toISOString(),
                   "updated_date": new Date().toISOString()
               }
            }
        };
        
        // Update recurrence
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
          default:
            nextScheduledDate = new Date();
            break;
        }
        // Update counter
        i++;
    }
}

/*
* Build params for date
*/
function buildParamsForDate(walletId, sk) {
    let length = params.RequestItems.blitzbudget.length;
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
* Get Category Data
*/
function getCategoryData(pk, today, originalCategory) {
  var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :pk AND begins_with(sk, :items)",
      ExpressionAttributeValues: {
          ":pk": pk,
          ":items": "Category#" + today.substring(0,4) + '-' + today.substring(5,7)
      },
      ProjectionExpression: "pk, sk, category_name, category_type"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        DB.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved - Category %j", data.Count, " for the date ", today);
            /*
            * Create a new sortkey is necessary
            */
            let sortKeyDate = new Date();
            sortKeyDate.setFullYear(today.substring(0,4));
            sortKeyDate.setMonth(parseInt(today.substring(5,7)) -1);
            let sortKey = "Category#" + sortKeyDate.toISOString();
            if(data.Count > 0) {
                for(const item of data.Items) {
                    if(item['category_name'] == originalCategory.CategoryToCopy.Item['category_name']
                    && item['category_type'] == originalCategory.CategoryToCopy.Item['category_type']) {
                        sortKey = item.sk;
                        console.log("There is a positive match for the category %j", item.sk);
                    }
                }
            } else {
                console.log("Since the count is 0 for the month %j", today, " sending the originalcategory ", originalCategory.CategoryToCopy.Item.sk);
            }
            
            resolve({ 
                    "sortKey" : sortKey, 
                    "dateMeantFor": today
                });  
          }
        });
    });
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
    let nextScheduledDate = new Date(nextScheduled);
    let today =  new Date();
    let i = 0;
    
    while (nextScheduledDate < today) {
        console.log("The scheduled date is %j", nextScheduledDate);
        
        /*
        * Scheduled Transactions
        */
        let nextScheduledDateAsString = nextScheduledDate.getFullYear() + '-' + ('0' + (nextScheduledDate.getMonth() + 1)).slice(-2);
        if(notIncludesStr(nextSchArray, nextScheduledDateAsString)) {
            nextSchArray.push(nextScheduledDateAsString);   
        }
        
        
        // Update recurrence
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
          default:
            nextScheduledDate = new Date();
            break;
        }
        // Update counter
        i++;
    }
    
    /*
    * Set the next date field for recurring transaction
    */
    recurringTransactionsNextSch = nextScheduledDate.toISOString();
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

function isNotEmpty(obj) {
  return !isEmpty(obj);
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
