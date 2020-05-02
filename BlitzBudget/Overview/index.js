// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});
let events = [];


exports.handler = async (event) => {
  events = [];
  console.log("fetching item for the walletId ", event.params.querystring.walletId);
  let overviewData = [];
  let walletId = event.params.querystring.walletId;
  let dateMeantFor = event.params.querystring.dateMeantFor;
  let userId = event.params.querystring.userId;
  
  if(isEmpty(walletId) && isNotEmpty(userId)) {
      await getWalletsData(userId).then(function(result) {}, function(err) {
         throw new Error("Unable error occured while fetching the transaction " + err);
      });
  } else if(isNotEmpty(walletId) && isNotEmpty(userId)) {
    events.push(getWalletData(userId, walletId));
  }
  
  events.push(getTransactionsData(walletId, dateMeantFor));
  events.push(getBudgetsData(walletId, dateMeantFor));
  events.push(getCategoryData(walletId, dateMeantFor));
  events.push(getBankAccountData(walletId, dateMeantFor));
  
  await Promise.all(events).then(function(result) {
     overviewData = result;
     console.log("Cumilative data retrieved ", overviewData);
  }, function(err) {
     throw new Error("Unable error occured while fetching the transaction " + err);
  });
  
  /*
  * Get Date Individually
  */
  let dateData = await getDateData(walletId, dateMeantFor).then(function(result) {}, function(err) {
     throw new Error("Unable error occured while fetching the transaction " + err);
  });
  
  console.log("date entry %j", dateData);
  if(isEmpty(dateData.Date) && isNotEmpty(overviewData[3].BankAccount)) {
    console.log("Date entry is empty so creating the date object");
    dateData = await updateDateData(walletId, dateMeantFor).then(function(result) {}, function(err) {
      throw new Error("Unable error occured while fetching the transaction " + err);
    });
  }
  overviewData.push(dateData);

  return overviewData;
};

function getWalletData(userId, walletId) {
    
    var params = {
      AttributesToGet: [
        "currency",
        "total_asset_balance", 
        "total_debt_balance", 
        "wallet_balance"
      ],
      TableName : 'blitzbudget',
      Key : { 
        "pk" : {
          "S" : userId
        },
        "sk" : {
          "S" : walletId
        }
      }
    }
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.getItem(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved ", JSON.stringify(data.Items));
            resolve({ "BankAccount" : data.Items});
          }
        });
    });
}

function getWalletsData(userId) {
  var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :pk and begins_with(sk, :items)",
      ExpressionAttributeValues: {
          ":pk": userId,
          ":items": "Wallet#"
      },
      ProjectionExpression: "currency, pk, sk, read_only, total_asset_balance, total_debt_balance, wallet_balance"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved ", JSON.stringify(data.Items));
            resolve({ "BankAccount" : data.Items});
          }
        });
    });
}

function updateDateData(pk, dateMeantFor) {
  let today = new Date();
  today.setYear(dateMeantFor.substring(0,4));
  today.setMonth(parseInt(dateMeantFor.substring(5,7)) -1);
  let randomValue = "Date#" + today.toISOString(); 
  
  var params = {
      TableName:'blitzbudget',
      Key:{
        "pk": pk,
        "sk": randomValue,
      },
      UpdateExpression: "set income_total = :r, expense_total=:p, balance=:a",
      ExpressionAttributeValues:{
          ":r":0,
          ":p":0,
          ":a":0
      },
      ReturnValues: 'ALL_NEW'
  }
  
  console.log("Adding a new item...");
  return new Promise((resolve, reject) => {
    docClient.update(params, function(err, data) {
        if (err) {
          console.log("Error ", err);
          reject(err);
        } else {
          resolve({ "date" : data});
        }
    });
  });
  
}

function getBankAccountData(pk, dateMeantFor) {
    var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :pk and begins_with(sk, :items)",
      ExpressionAttributeValues: {
          ":pk": pk,
          ":items": "BankAccount#"
      },
      ProjectionExpression: "bank_account_name, linked, bank_account_number, account_balance, sk, pk, selected_account, number_of_times_selected, account_type"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved ", JSON.stringify(data.Items));
            resolve({ "BankAccount" : data.Items});
          }
        });
    });
}

function getCategoryData(pk, dateMeantFor) {
    var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :pk and begins_with(sk, :sk)",
      ExpressionAttributeValues: {
          ":pk": pk,
          ":sk": "Category#" + dateMeantFor
      },
      ProjectionExpression: "pk, sk, category_name, category_total"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved ", JSON.stringify(data.Items));
            resolve({ "Category" : data.Items});
          }
        });
    });
}

function getDateData(pk, dateMeantFor) {
    var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :pk and begins_with(sk, :sk)",
      ExpressionAttributeValues: {
          ":pk": pk,
          ":sk": "Date#" + dateMeantFor
      },
      ProjectionExpression: "pk, sk, income_total, expense_total, balance"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved ", JSON.stringify(data.Items));
            resolve({ "Date" : data.Items});
          }
        });
    });
}

function getBudgetsData(pk, dateMeantFor) {
    var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :pk and begins_with(sk, :sk)",
      ExpressionAttributeValues: {
          ":pk": pk,
          ":sk": "Budget#" + dateMeantFor
      },
      ProjectionExpression: "category, planned, sk, pk"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved ", JSON.stringify(data.Items));
            resolve({ "Budget" : data.Items});
          }
        });
    });
}


// Get Transaction Item
function getTransactionsData(pk, dateMeantFor) {
    var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :pk and begins_with(sk, :sk)",
      ExpressionAttributeValues: {
          ":pk": pk,
          ":sk": "Transaction#" + dateMeantFor
      },
      ProjectionExpression: "amount, description, category, recurrence, sk, pk"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved ", JSON.stringify(data.Items));
            resolve({ "Transaction" : data.Items});
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

function isNotEmpty(obj) {
  return !isEmpty(obj);
}

function includesStr(arr, val){
  return isEmpty(arr) ? null : arr.includes(val); 
}