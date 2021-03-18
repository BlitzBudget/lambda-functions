const Wallet = () => {};

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const constants = require('../constants/constant');
const walletParameter = require('../constants/constant');
// Set the region
AWS.config.update({ region: constants.EU_WEST_ONE });

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });

// Get Wallet Item
async function getWalletItem(userId, walletData) {
  const walletResponse = walletData;
  const params = walletParameter.createParameter(userId);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

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
