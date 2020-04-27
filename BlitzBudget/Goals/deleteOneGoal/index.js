// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log( 'event ' + JSON.stringify(event.params.querystring));
    await deleteOneGoal(event).then(function(result) {
       console.log("successfully deleted the goals");
    }, function(err) {
       throw new Error("Unable to delete the goals " + err);
    });
        
    return event;
};


function deleteOneGoal(event) {
    console.log('financial Portfolio Id selected for deletion is ' + event.params.querystring.financialPortfolioId);
    
    var params = {
        "TableName": 'blitzbudget', 
        "Key" : {
            "pk": event.params.querystring.financialPortfolioId,
            "sk": event.params.querystring.goalId
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