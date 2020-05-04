// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});
let walletData = {};


exports.handler = async (event) => {
  console.log("fetching item for the walletId ", event.params.querystring.walletId);
  walletData = {};
  
    await getWalletItem(event.params.querystring.walletId).then(function(result) {
       console.log("Successfully retrieved all wallet information");
    }, function(err) {
       throw new Error("Unable error occured while fetching the Wallet " + err);
    });

    return walletData;
};


// Get Wallet Item
function getWalletItem(walletId) {
    var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :walletId and begins_with(sk, :items)",
      ExpressionAttributeValues: {
          ":walletId": walletId,
          ":items": "Wallet#"
      },
      ProjectionExpression: "currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved ", JSON.stringify(data.Items));
            walletData['Wallet'] = data.Items;
            resolve(data.Items);
          }
        });
    });
}