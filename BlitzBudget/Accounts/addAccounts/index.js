// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("adding BankAccounts for ", JSON.stringify(event['body-json']));
    await addNewBankAccounts(event).then(function(result) {
       console.log("successfully saved the new BankAccounts");
    }, function(err) {
       throw new Error("Unable to add the BankAccounts " + err);
    });
        
    return event;
};

function addNewBankAccounts(event) {
    let today = new Date();
    let randomValue = "BankAccounts#" + today.toISOString(); 
        
    var params = {
      TableName:'blitzbudget',
      Item:{
            "pk": event['body-json'].financialPortfolioId,
            "sk": randomValue,
            "goal_type": event['body-json'].goalType,
            "final_amount": event['body-json'].targetAmount,
            "preferable_target_date": event['body-json'].targetDate,
            "target_id": event['body-json'].targetId,
            "target_type": event['body-json'].targetType
      }
    };
    
    console.log("Adding a new item...");
    return new Promise((resolve, reject) => {
      docClient.put(params, function(err, data) {
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