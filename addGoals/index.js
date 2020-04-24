// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    
    await addNewGoals(event).then(function(result) {
       console.log("successfully saved the new goals");
    }, function(err) {
       throw new Error("Unable to add the goals " + err);
    });
        
    return event;
};

function addNewGoals(event) {
    let today = new Date();
    let randomValue = today.getUTCDate().toString() + today.getUTCMonth().toString() + today.getUTCFullYear().toString() + today.getUTCHours().toString() + today.getUTCMinutes().toString() + today.getUTCSeconds().toString() + today.getUTCMilliseconds().toString(); 
        
    var goalsToAdd = JSON.stringify({
            'id' : randomValue,
            'currency' : event['body-json'].currency,
            'read_only' : event['body-json'].readOnly   
          })
          
    var params = {
      TableName: "goals",
      Key: { 'financial_portfolio_id' : event['body-json'].financialPortfolioId },
      UpdateExpression: "ADD #goals :goal",
      ExpressionAttributeNames: { "#goals" : "goals" },
      ExpressionAttributeValues: { ":goal": DB.createSet([goalsToAdd]) }
    };
    
    return new Promise((resolve, reject) => {
        DB.update(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            resolve({ "success" : true});
            event['body-json'].id= randomValue;
          }
        });
    });
    
}