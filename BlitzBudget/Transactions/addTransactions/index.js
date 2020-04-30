// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("adding goals for ", JSON.stringify(event['body-json']));
    await addNewTransaction(event).then(function(result) {
       console.log("successfully saved the new goals");
    }, function(err) {
       throw new Error("Unable to add the goals " + err);
    });
        
    return event;
};

function addNewTransaction(event) {
    let today = new Date();
    today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
    today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) -1);
    let randomValue = "Transaction#" + today.toISOString(); 
        
    var params = {
      TableName:'blitzbudget',
      Item:{
            "pk": event['body-json'].financialPortfolioId,
            "sk": randomValue,
            "amount": event['body-json'].amount,
            "description": event['body-json'].description,
            "category": event['body-json'].category,
            "recurrence": event['body-json'].recurrence,
            "account": event['body-json'].account,
            "date": event['body-json'].dateMeantFor
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