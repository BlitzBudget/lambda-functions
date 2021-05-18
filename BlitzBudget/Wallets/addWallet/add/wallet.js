function Wallet() {}

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const constants = require('../constants/constant');
const organizeWallet = require('../organize/wallet');
const walletParameter = require('../create-parameter/wallet');

// Set the region
AWS.config.update({
  region: constants.AWS_LAMBDA_REGION,
});

// Create the DynamoDB service object
const dynamoDB = new AWS.DynamoDB();
const documentClient = dynamoDB.DocumentClient();

async function addNewWallet(event, userId, chosenCurrency, walletName) {
  const today = new Date();
  const randomValue = `Wallet#${today.toISOString()}`;

  const params = walletParameter.createParameter(userId, randomValue, chosenCurrency, walletName);

  console.log('Adding a new item...');

  const response = await documentClient.put(params).promise();

  return ({
    Wallet: response,
    WalletResponse: organizeWallet.organize(event, randomValue),
  });
}

Wallet.prototype.addNewWallet = addNewWallet;
// Export object
module.exports = new Wallet();
