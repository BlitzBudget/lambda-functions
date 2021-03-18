const Wallet = () => {};

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const constants = require('../constants/constant');
// Set the region
AWS.config.update({ region: 'eu-west-1' });

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });

// Get Wallet Item
async function getWalletItem(userId, walletData) {
  const walletResponse = walletData;
  const params = {
    TableName: constants.TABLE_NAME,
    KeyConditionExpression: 'pk = :userId and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':items': 'Wallet#',
    },
    ProjectionExpression:
      'currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance, wallet_name',
  };

  // Call DynamoDB to read the item from the table
  const response = await docClient.query(params).promise();

  if (response.Items) {
    Object.keys(response.Items).forEach((walletObj) => {
      const walletItem = walletObj;
      walletItem.walletId = walletObj.sk;
      walletItem.userId = walletObj.pk;
      delete walletItem.sk;
      delete walletItem.pk;
    });
  }
  walletResponse.Wallet = response.Items;
  return (response.Items);
}

Wallet.prototype.getWalletItem = getWalletItem;
// Export object
module.exports = new Wallet();
