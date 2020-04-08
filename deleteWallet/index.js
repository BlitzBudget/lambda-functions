// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    
    await deleteWallet(event).then(function(result) {
       console.log("successfully deleted the wallet");
    }, function(err) {
       throw new Error("Unable to delete the wallet " + err);
    });
        
    return event;
};


function deleteWallet(event) {
    console.log('financial Portfolio Id selectedt for deletion is ' + event.params.querystring.financialPortfolioId);
    
    var params = {
            "TableName": 'wallet', 
            "Key" : {
                "financial_portfolio_id": event.params.querystring.financialPortfolioId
            }
        }
        
    return new Promise((resolve, reject) => {
        DB.delete(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            resolve({ "success" : data});
          }
        });
    });
}