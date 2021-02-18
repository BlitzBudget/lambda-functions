const Wallet = () => {};

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({ region: 'eu-west-1' });

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });

// Get Wallet Item
function getWalletItem(userId, walletData) {
  const walletResponse = walletData;
  const params = {
    TableName: 'blitzbudget',
    KeyConditionExpression: 'pk = :userId and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':items': 'Wallet#',
    },
    ProjectionExpression:
      'currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance, wallet_name',
  };

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('data retrieved ', data.Count);
        if (data.Items) {
          Object.keys(data.Items).forEach((walletObj) => {
            const walletItem = walletObj;
            walletItem.walletId = walletObj.sk;
            walletItem.userId = walletObj.pk;
            delete walletItem.sk;
            delete walletItem.pk;
          });
        }
        walletResponse.Wallet = data.Items;
        resolve(data.Items);
      }
    });
  });
}

Wallet.prototype.getWalletItem = getWalletItem;
// Export object
module.exports = new Wallet();
