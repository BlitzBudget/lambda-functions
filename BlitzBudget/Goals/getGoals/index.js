// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});


exports.handler = async (event) => {
    console.log("fetching item for the walletId ", event.params.querystring.walletId);
    let goalData = [];
    let events = [];
    let userId = event.params.querystring.userId;
    let walletId = event.params.querystring.walletId;

    // Cognito does not store wallet information nor curreny. All are stored in wallet.
    if(isEmpty(walletId) && isNotEmpty(userId)) {
        await getWalletsData(userId).then(function(result) {
          walletId = result.Wallet[0].sk;
          console.log("retrieved the wallet for the item ", walletId);
        }, function(err) {
           throw new Error("Unable error occured while fetching the transaction " + err);
        });
    }
    
    events.push(getBankAccountData(walletId));
    events.push(getGoalItem(walletId));

    await Promise.all(events).then(function(result) {
       goalData = result;
    }, function(err) {
       throw new Error("Unable error occured while fetching the goal " + err);
    });

    return goalData;
};

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


// Get goal Item
function getGoalItem(walletId) {
    var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :walletId and begins_with(sk, :items)",
      ExpressionAttributeValues: {
          ":walletId": walletId,
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
            console.log("data retrieved - Goal %j", JSON.stringify(data.Items));
            resolve({ "Goal" : data.Items});
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