// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("adding Budget for ", JSON.stringify(event['body-json']));
    await addNewBudget(event).then(function(result) {
       console.log("successfully saved the new Budget");
    }, function(err) {
       throw new Error("Unable to add the Budget " + err);
    });
        
    return event;
};

function addNewBudget(event) {
    let today = new Date();
    today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
    today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) -1);
    let randomValue = "Budget#" + today.toISOString(); 
        
    var params = {
      TableName:'blitzbudget',
      Item:{
            "pk": event['body-json'].financialPortfolioId,
            "sk": randomValue,
            "category": event['body-json'].category,
            "planned": event['body-json'].planned,
            "auto_generated": false,
            "date_meant_for": event['body-json'].dateMeantFor,
            "creation_date": new Date().toISOString(),
            "updated_date": new Date().toISOString()
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