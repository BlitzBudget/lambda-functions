// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});
let walletData = {};


exports.handler = async (event) => {
  console.log("fetching item for the userId ", event['body-json'].userId);
  walletData = {};
  
    await getWalletItem(event['body-json'].userId).then(function(result) {
       console.log("Successfully retrieved all wallet information");
    }, function(err) {
       throw new Error("Unable error occured while fetching the Wallet " + err);
    });

    return walletData;
};


// Get Wallet Item
function getWalletItem(userId) {
    var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :userId and begins_with(sk, :items)",
      ExpressionAttributeValues: {
          ":userId": userId,
          ":items": "Wallet#"
      },
      ProjectionExpression: "currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance, name"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved ", data.Count);
            if(data.Items) {
              for(const walletObj of data.Items) {
                walletObj.walletId = walletObj.sk;
                walletObj.userId = walletObj.pk;
                delete walletObj.sk;
                delete walletObj.pk;
              }
            }
            walletData['Wallet'] = data.Items;
            resolve(data.Items);
          }
        });
    });
}