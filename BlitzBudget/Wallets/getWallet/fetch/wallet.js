function Wallet() {}

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const constants = require('../constants/constant');
const walletParameter = require('../create-parameter/wallet');
const organizeWallet = require('../organize/wallet');
// Set the region
AWS.config.update({ region: constants.AWS_LAMBDA_REGION });

// Create the DynamoDB service object
const dynamoDB = new AWS.DynamoDB();
const documentClient = dynamoDB.DocumentClient();

// Get Wallet Item
async function getWalletItem(userId, walletData) {
  const walletResponse = walletData;
  const params = walletParameter.createParameter(userId);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  organizeWallet.organize(response);
  walletResponse.Wallet = response.Items;
  return {
    Wallet: walletResponse,
  };
}

Wallet.prototype.getWalletItem = getWalletItem;
// Export object
module.exports = new Wallet();
