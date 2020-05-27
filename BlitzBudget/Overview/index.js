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
  console.log("fetching item for the walletId %j", event['body-json'].walletId);
  console.log("fetching item with the userId %j", event['body-json'].userId);
  let walletId = event['body-json'].walletId;
  let userId = event['body-json'].userId;

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
  
  // Cognito does not store wallet information nor curreny. All are stored in wallet.
  if(isEmpty(walletId) && isNotEmpty(userId)) {
      await getWalletsData(userId).then(function(result) {
        walletId = result.Wallet[0].walletId;
        console.log("retrieved the wallet for the item ", walletId);
      }, function(err) {
         throw new Error("Unable error occured while fetching the transaction " + err);
      });
  } else if(isNotEmpty(walletId) && isNotEmpty(userId)) {
    events.push(getWalletData(userId, walletId));
  }

  // To display Category name
  events.push(getCategoryData(walletId, startsWithDate, endsWithDate));
  // To display first 20 transactions in reverse order
  events.push(getTransactionItem(walletId, startsWithDate, endsWithDate));
  // Get Bank account for preview
  events.push(getBankAccountData(walletId));
  // Get Budgets to calculate overspent budget
  events.push(getBudgetsItem(walletId, startsWithDate, endsWithDate));
  // Get Dates information to calculate the monthly Income / expense per month
  events.push(getDateData(walletId, oneYearAgo, endsWithDate));
  
  await Promise.all(events).then(function(result) {
     console.log("Cumilative data retrieved ", overviewData);
  }, function(err) {
     throw new Error("Unable error occured while fetching the transaction " + err);
  });
  
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
            console.log("data retrieved ", data.Count);
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
            if(data.Item) {
                data.Item.walletId = data.Item.sk;
                data.Item.userId = data.Item.pk;
                delete data.Item.sk;
                delete data.Item.pk;
            }
            overviewData['Wallet'] = data.Item;
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
            console.log("data retrieved - Wallet %j", data.Count);
            if(data.Items) {
              for(const walletObj of data.Items) {
                walletObj.walletId = walletObj.sk;
                walletObj.userId = walletObj.pk;
                delete walletObj.sk;
                delete walletObj.pk;
              }
            }
            overviewData['Wallet'] = data.Items;
            resolve({ "Wallet" : data.Items});
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
            console.log("data retrieved - Bank Account %j", data.Count);
            if(data.Items) {
              for(const accountObj of data.Items) {
                accountObj.accountId = accountObj.sk;
                accountObj.walletId = accountObj.pk;
                delete accountObj.sk;
                delete accountObj.pk;
              }
            }
            overviewData['BankAccount'] = data.Items;
            resolve({ "BankAccount" : data.Items});
          }
        });
    });
}

function getCategoryData(pk, startsWithDate, endsWithDate) {
  var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :pk and sk BETWEEN :bt1 AND :bt2",
      ExpressionAttributeValues: {
          ":pk": pk,
          ":bt1": "Category#" + startsWithDate,
          ":bt2": "Category#" + endsWithDate
      },
      ProjectionExpression: "pk, sk, category_name, category_total, category_type"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved - Category %j", data.Count);
            if(data.Items) {
              for(const categoryObj of data.Items) {
                categoryObj.categoryId = categoryObj.sk;
                categoryObj.walletId = categoryObj.pk;
                delete categoryObj.sk;
                delete categoryObj.pk;
              }
            }
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
            console.log("data retrieved - Date ", data.Count);
            if(data.Items) {
              for(const dateObj of data.Items) {
                dateObj.dateId = dateObj.sk;
                dateObj.walletId = dateObj.pk;
                delete dateObj.sk;
                delete dateObj.pk;
              }
            }
            overviewData['Date'] = data.Items;
            resolve({ "Date" : data.Items});
          }
        });
    });
}

// Get Budget Item
function getBudgetsItem(walletId, startsWithDate, endsWithDate) {
    var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :walletId AND sk BETWEEN :bt1 AND :bt2",
      ExpressionAttributeValues: {
          ":walletId": walletId,
          ":bt1": "Budget#" + startsWithDate,
          ":bt2": "Budget#" + endsWithDate
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
             console.log("data retrieved - Budget %j", data.Count);
            if(data.Items) {
              for(const budgetObj of data.Items) {
                budgetObj.budgetId = budgetObj.sk;
                budgetObj.walletId = budgetObj.pk;
                delete budgetObj.sk;
                delete budgetObj.pk;
              }
            }
            overviewData['Budget'] = data.Items;
            resolve({ "Budget" : data.Items});
          }
        });
    });
}


// Get Transaction Item
function getTransactionItem(pk, startsWithDate, endsWithDate) {
    var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :pk and sk BETWEEN :bt1 AND :bt2",
      ExpressionAttributeValues: {
          ":pk": pk,
          ":bt1": "Transaction#" + startsWithDate,
          ":bt2": "Transaction#" + endsWithDate
      },
      ProjectionExpression: "amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date",
      ScanIndexForward: false
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
             console.log("data retrieved - Transactions %j ", data.Count);
            if(data.Items) {
              for(const transObj of data.Items) {
                transObj.transactionId = transObj.sk;
                transObj.walletId = transObj.pk;
                delete transObj.sk;
                delete transObj.pk;
              }
            }
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