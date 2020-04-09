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
    let randomValue = today.getUTCDate().toString() + today.getUTCMonth().toString() + today.getUTCFullYear().toString() + today.getUTCHours().toString() + today.getUTCMinutes().toString() + today.getUTCSeconds().toString() + today.getUTCMilliseconds().toString(); 
        
    var walletToAdd = JSON.stringify({
            'id' : randomValue,
            'currency' : event['body-json'].currency,
            'read_only' : event['body-json'].readOnly   
          })
          
    var params = {
      TableName: "wallet",
      Key: { 'financial_portfolio_id' : event['body-json'].financialPortfolioId },
      UpdateExpression: "ADD #wallets :wallet",
      ExpressionAttributeNames: { "#wallets" : "wallets" },
      ExpressionAttributeValues: { ":wallet": DB.createSet([walletToAdd]) }
    };
    
    return new Promise((resolve, reject) => {
        DB.update(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            resolve({ "success" : true});
          }
        });
    });
    
}
