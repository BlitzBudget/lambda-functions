// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    let walletId = isEmpty(event.Records) ? event['body-json'].walletId : event.Records[0].Sns.Message;
    let currency = isEmpty(event.Records) ? event['body-json'].currency : event.Records[0].Sns.MessageAttributes.currency.Value;
    console.log("events ", JSON.stringify(event));
    await addNewWallet(event, walletId, currency).then(function(result) {
       console.log("successfully saved the new wallet");
    }, function(err) {
       throw new Error("Unable to add the wallet " + err);
    });
        
    return event;
};

function addNewWallet(event, walletId, currency) {
    let today = new Date();
    let randomValue = "Wallet#" + today.toISOString(); 
        
    var params = {
      TableName:'blitzbudget',
      Item:{
            "pk": walletId,
            "sk": randomValue,
            "currency": currency,
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
            if(isNotEmpty(event['body-json'])) {
              event['body-json'].id= randomValue; 
            }
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