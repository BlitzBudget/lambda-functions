// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});


exports.handler = async (event) => {
  console.log("fetching item for the financialPortfolioId ", event.params.querystring.financialPortfolioId);
  let transactionData = [];
  
    await getTransactionItem(event.params.querystring.financialPortfolioId).then(function(result) {
       transactionData = result;
    }, function(err) {
       throw new Error("Unable error occured while fetching the transaction " + err);
    });

    return transactionData;
};


// Get Transaction Item
function getTransactionItem(financialPortfolioId) {
    var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :financialPortfolioId and begins_with(sk, :items)",
      ExpressionAttributeValues: {
          ":financialPortfolioId": financialPortfolioId,
          ":items": "Transaction#"
      },
      ProjectionExpression: "amount, description, category, recurrence, sk, pk"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved ", JSON.stringify(data.Items));
            resolve(data);
          }
        });
    });
}