// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    
    await addNewWallet(event).then(function(result) {
       console.log("successfully saved the new wallet");
    }, function(err) {
       throw new Error("Unable to add the wallet " + err);
    });
        
    return event;
};

function addNewWallet(event) {
    let today = new Date();
    let randomValue = "Wallet#" + today.toISOString(); 
        
    var params = {
      TableName:'blitzbudget',
      Item:{
            "pk": event['body-json'].walletId,
            "sk": randomValue,
            "currency": event['body-json'].currency,
            "wallet_balance": 0,
            "total_asset_balance": 0,
            "total_debt_balance": 0,
            "creation_date": new Date().toISOString(),
            "updated_date": new Date().toISOString()
      }
    };
    
    console.log("Adding a new item...");
    return new Promise((resolve, reject) => {
      DB.put(params, function(err, data) {
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