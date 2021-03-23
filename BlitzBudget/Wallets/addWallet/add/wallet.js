const Wallet = () => {};

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const constants = require('../constants/constant');
const walletParameter = require('../create-parameter/wallet');

// Set the region
AWS.config.update({
  region: constants.EU_WEST_ONE,
});

const helper = require('../utils/helper');

// Create the DynamoDB service object
const DB = new AWS.DynamoDB.DocumentClient();

async function addNewWallet(event, userId, chosenCurrency, walletName) {
  const today = new Date();
  const randomValue = `Wallet#${today.toISOString()}`;

  const params = walletParameter.createParameter(userId, randomValue, chosenCurrency, walletName);

  function addInfoToResponse() {
    const response = event['body-json'];
    if (helper.isNotEmpty(response)) {
      response.walletId = randomValue;
      response.wallet_balance = 0;
      response.total_debt_balance = 0;
      response.total_asset_balance = 0;
    }
  }

  console.log('Adding a new item...');

  const response = await DB.put(params).promise();

  addInfoToResponse();
  return ({
    success: response,
  });
}

Wallet.prototype.addNewWallet = addNewWallet;
// Export object
module.exports = new Wallet();
