// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});
let events = [];
let overviewData = {};


exports.handler = async (event) => {
  events = [];
  overviewData = {};
  console.log("fetching item for the walletId ", event.params.querystring.walletId);
  let walletId = event.params.querystring.walletId;
  let today = new Date();
  let dateMeantFor = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2);
  console.log("dateMeantFor %j", dateMeantFor);
  let userId = event.params.querystring.userId;

  /*
  * Get all dates from one year ago
  */
  let endsWithDate = today.toISOString();
  let twelveMonthsAgo = today;
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  twelveMonthsAgo.setDate(1);
  let startsWithDate = twelveMonthsAgo.toISOString();
  
  // Cognito does not store wallet information nor curreny. All are stored in wallet.
  if(isEmpty(walletId) && isNotEmpty(userId)) {
      await getWalletsData(userId).then(function(result) {
        walletId = result.Wallet[0].sk;
        console.log("retrieved the wallet for the item ", walletId);
      }, function(err) {
         throw new Error("Unable error occured while fetching the transaction " + err);
      });
  } else if(isNotEmpty(walletId) && isNotEmpty(userId)) {
    events.push(getWalletData(userId, walletId));
  }
  
  // To display Category name
  events.push(getCategoryData(walletId, dateMeantFor));
  // To display first 20 transactions in reverse order
  events.push(getTransactionsData(walletId, dateMeantFor));
  // Get Bank account for preview
  events.push(getBankAccountData(walletId));
  // Get Budgets to calculate overspent budget
  events.push(getBudgetsData(walletId, dateMeantFor));
  // Get Dates information to calculate the monthly Income / expense per month
  events.push(getDateData(walletId, startsWithDate, endsWithDate));
  
  await Promise.all(events).then(function(result) {
    let c = 0;

     console.log("Cumilative data retrieved ", overviewData);
  }, function(err) {
     throw new Error("Unable error occured while fetching the transaction " + err);
  });
  
  console.log("date entry is Empty? %j", isEmpty(overviewData.Date));
  if(isEmpty(overviewData.Date)) {
    console.log("Date entry is empty so creating the date object");
    await updateDateData(walletId).then(function(result) {
      overviewData['Date'].push(result);
    }, function(err) {
      throw new Error("Unable error occured while fetching the transaction " + err);
    });
  }
  
  return overviewData;
};

function getGoalsData(pk) {
  var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :pk and begins_with(sk, :items)",
      ExpressionAttributeValues: {
          ":pk": pk,
          ":items": "Goal#"
      },
      ProjectionExpression: "preferable_target_date, target_id, target_type, goal_type, sk, pk, final_amount"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved ", JSON.stringify(data.Items));
            resolve({ "Goal" : data.Items});
          }
        });
    });
}

function getWalletData(userId, walletId) {
    console.log("fetching the wallet information for the user %j", userId, " with the wallet ", walletId);
    var params = {
      AttributesToGet: [
        "currency",
        "total_asset_balance", 
        "total_debt_balance", 
        "wallet_balance"
      ],
      TableName : 'blitzbudget',
      Key : { 
        "pk" : userId,
        "sk" : walletId
      }
    }
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.get(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved - Wallet %j", JSON.stringify(data));
            overviewData['Wallet'] = data.Items;
            resolve({ "Wallet" : data});
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
            console.log("data retrieved - Wallet %j", JSON.stringify(data.Items));
            overviewData['Wallet'] = data.Items;
            resolve({ "Wallet" : data.Items});
          }
        });
    });
}

function updateDateData(pk) {
  let today = new Date();
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

function getBankAccountData(pk) {
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
            console.log("data retrieved - Bank Account %j", JSON.stringify(data.Items));
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
            console.log("data retrieved - Category %j", JSON.stringify(data.Items));
            overviewData['Category'] = data.Items;
            resolve({ "Category" : data.Items});
          }
        });
    });
}

function getDateData(pk, startsWithDate, endsWithDate) {
    var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :pk and sk BETWEEN :bt1 AND :bt2",
      ExpressionAttributeValues: {
          ":pk": pk,
          ":bt1": "Date#" + startsWithDate,
          ":bt2": "Date#" + endsWithDate
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
            console.log("data retrieved - Date ", JSON.stringify(data.Items));
            overviewData['Date'] = data.Items;
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
            console.log("data retrieved - Budget %j", JSON.stringify(data.Items));
            overviewData['Budget'] = data.Items;
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
      ProjectionExpression: "amount, description, category, recurrence, sk, pk",
      ScanIndexForward: false,
      Limit: 20
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved - Transactions %j ", JSON.stringify(data.Items));
            overviewData['Transaction'] = data.Items;
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

function isEqual(obj1,obj2){
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
      return true;
  }
  return false;
}