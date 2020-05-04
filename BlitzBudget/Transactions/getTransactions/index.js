// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});
let transactionData = {};

exports.handler = async (event) => {
    transactionData = {};
    console.log("fetching item for the walletId ", event.params.querystring.walletId);
    let events = [];
    let userId = event.params.querystring.userId;
    let walletId = event.params.querystring.walletId;
    let startsWithDate = event.params.querystring.startsWithDate;
    let endsWithDate = event.params.querystring.endsWithDate;
    let fullMonth = isFullMonth(startsWithDate, endsWithDate);
    
    // Cognito does not store wallet information nor curreny. All are stored in wallet.
    if(isEmpty(walletId) && isNotEmpty(userId)) {
        await getWalletsData(userId).then(function(result) {
          walletId = result.Wallet[0].walletId;
          console.log("retrieved the wallet for the item ", walletId);
        }, function(err) {
           throw new Error("Unable error occured while fetching the transaction " + err);
        });
    }
  
    events.push(getTransactionItem(walletId, startsWithDate, endsWithDate));
    events.push(getCategoryData(walletId, startsWithDate, endsWithDate));
    events.push(getBankAccountData(walletId));
    events.push(getDateData(walletId, startsWithDate.substring(0,4)));
    await Promise.all(events).then(function(result) {
      console.log("Successfully fetched all the relevant information");
    }, function(err) {
       throw new Error("Unable error occured while fetching the Budget " + err);
    });

    calculateDateAndCategoryTotal(fullMonth);
    return transactionData;
};

function calculateDateAndCategoryTotal(fullMonth) {
    let categoryList = {}; 
    let incomeTotal = 0, expenseTotal = 0, periodBalance = 0;
      
    for(const transObj of transactionData.Transaction) {
        if(isEmpty(categoryList[transObj.category])) {
          categoryList[transObj.category] = transObj.amount; 
        } else {
          categoryList[transObj.category] += transObj.amount; 
        }
        transObj.transactionId = transObj.sk;
        transObj.walletId = transObj.pk;
        delete transObj.sk;
        delete transObj.pk;
    }
    
    for(const categoryObj of transactionData.Category) {
       if(isNotEmpty(categoryList[categoryObj.sk]) &&  !fullMonth) {
          categoryObj['category_total'] = categoryList[categoryObj.sk];
       }
       
       if(isEqual(categoryObj['category_type'], 'Income')) {
         incomeTotal += categoryList[categoryObj.sk];
       } else if(isEqual(categoryObj['category_type'], 'Expense')) {
         expenseTotal += categoryList[categoryObj.sk];
       }
       periodBalance = incomeTotal - expenseTotal;
       categoryObj.categoryId = categoryObj.sk;
       categoryObj.walletId = categoryObj.pk;
       delete categoryObj.sk;
       delete categoryObj.pk;
    }
    
    for(const dateObj of transactionData.Date) {
      dateObj.dateId = dateObj.sk;
      dateObj.walletId = dateObj.pk;
      delete dateObj.sk;
      delete dateObj.pk;
    }
    
    transactionData.incomeTotal = incomeTotal;
    transactionData.expenseTotal = expenseTotal;
    transactionData.balance = periodBalance;
    
}

/*
* Calculate difference between startdate and end date
*/
function isFullMonth(startsWithDate, endsWithDate) {
  startsWithDate = new Date(startsWithDate);
  endsWithDate = new Date(endsWithDate);
  
  if(isNotEqual(startsWithDate.getMonth(), endsWithDate.getMonth()) || isNotEqual(startsWithDate.getFullYear(), endsWithDate.getFullYear())) {
    console.log("The month and the year do not coincide"); 
    return false;
  }

  let firstDay = new Date(startsWithDate.getFullYear(), startsWithDate.getMonth());
  let lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth()+1, 0);

  if(isEqual(firstDay.getDate(), startsWithDate.getDate()) && isEqual(lastDay.getDate(), endsWithDate.getDate())) {
    return true;
  }
  
  return false;
}

function getDateData(pk, year) {
  var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :pk and begins_with(sk, :items)",
      ExpressionAttributeValues: {
          ":pk": pk,
          ":items": "Date#" + year
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
            console.log("data retrieved - Date %j", JSON.stringify(data.Items));
            transactionData['Date'] = data.Items;
            resolve({ "Date" : data.Items});
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
      ProjectionExpression: "amount, description, category, recurrence, sk, pk"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved - Transactions %j", JSON.stringify(data.Items));
            transactionData['Transaction'] = data.Items;
            resolve({ "Transaction" : data.Items});
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
            console.log("data retrieved - Category %j", JSON.stringify(data.Items));
            transactionData['Category'] = data.Items;
            resolve({ "Category" : data.Items});
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
            transactionData['BankAccount'] = data.Items;
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
            console.log("data retrieved - Wallet %j", JSON.stringify(data.Items));
            for(const walletObj of data.Items) {
              walletObj.walletId = walletObj.sk;
              walletObj.userId = walletObj.pk;
              delete walletObj.sk;
              delete walletObj.pk;
            }
            transactionData['Wallet'] = data.Items;
            resolve({ "Wallet" : data.Items});
          }
        });
    });
}


function isEmpty(obj) {
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

function isNotEqual(obj1,obj2){
  return !isEqual(obj1,obj2);
}