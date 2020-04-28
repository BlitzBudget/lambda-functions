// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("adding goals for ", JSON.stringify(event['body-json']));
    await addNewGoals(event).then(function(result) {
       console.log("successfully saved the new goals");
    }, function(err) {
       throw new Error("Unable to add the goals " + err);
    });
        
    return event;
};

function addNewGoals(event) {
    let today = new Date(event['body-json'].dateMeantFor);
    let randomValue = "Budget#" + today.toISOString(); 
        
    var params = {
      TableName:'blitzbudget',
      Item:{
            "pk": event['body-json'].financialPortfolioId,
            "sk": randomValue,
            "category": event['body-json'].category,
            "planned": event['body-json'].planned,
            "auto_generated": false,
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