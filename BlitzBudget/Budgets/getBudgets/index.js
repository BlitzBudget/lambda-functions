// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});


exports.handler = async (event) => {
    let budgetData = {};
    let events = [];
    let walletId = event.params.querystring.walletId;
    let startsWithDate = event.params.querystring.startsWithDate;
    let endsWithDate = event.params.querystring.endsWithDate;
    console.log("fetching item for the walletId ", walletId, " with the start date ", startsWithDate, " and end date ", endsWithDate);

    let userId = event.params.querystring.userId;

    // Cognito does not store wallet information nor curreny. All are stored in wallet.
    if(isEmpty(walletId) && isNotEmpty(userId)) {
        await getWalletsData(userId).then(function(result) {
          walletId = result.Wallet[0].sk;
          console.log("retrieved the wallet for the item ", walletId);
        }, function(err) {
           throw new Error("Unable error occured while fetching the transaction " + err);
        });
    }
  
    events.push(getBudgetsItem(walletId, startsWithDate, endsWithDate));
    events.push(getCategoryData(walletId, startsWithDate, endsWithDate));
    events.push(getDateData(walletId, startsWithDate.substring(0,4), endsWithDate.substring(0,4)));
    await Promise.all(events).then(function(result) {
      budgetData['Budget'] = result[0].Budget;
      budgetData['Category'] = result[1].Category;
      budgetData['Date'] = result[2].Date;
    }, function(err) {
       throw new Error("Unable error occured while fetching the Budget " + err);
    });

    return budgetData;
};

function getDateData(pk, startsWithYear, endsWithYear) {
  var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :pk and sk BETWEEN :bt1 AND :bt2",
      ExpressionAttributeValues: {
          ":pk": pk,
          ":bt1": "Transaction#" + startsWithYear,
          ":bt2": "Transaction#" + endsWithYear
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
            console.log("data retrieved ", JSON.stringify(data.Items));
            resolve({"Budget" : data.Items});
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
          ":bt2": "Category#" + endsWithDate,
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
            resolve({ "Category" : data.Items});
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