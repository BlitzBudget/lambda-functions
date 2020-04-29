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
            "pk": event['body-json'].financialPortfolioId,
            "sk": randomValue,
            "currency": event['body-json'].currency,
            "read_only": event['body-json'].readOnly,
            "wallet_balance": 0
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