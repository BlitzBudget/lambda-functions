const wallet = () => {};

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

const Helper = require('../utils/helper');

// Create the DynamoDB service object
const DB = new AWS.DynamoDB.DocumentClient();

function addNewWallet(event, userId, currency, walletName) {
  const today = new Date();
  const randomValue = `Wallet#${today.toISOString()}`;

  function createParameters() {
    return {
      TableName: 'blitzbudget',
      Item: {
        pk: userId,
        sk: randomValue,
        currency,
        wallet_name: walletName,
        wallet_balance: 0,
        total_asset_balance: 0,
        total_debt_balance: 0,
        creation_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
    };
  }

  const params = createParameters();

  function addInfoToResponse() {
    const response = event['body-json'];
    if (Helper.isNotEmpty()) {
      response.walletId = randomValue;
      response.wallet_balance = 0;
      response.total_debt_balance = 0;
      response.total_asset_balance = 0;
    }
  }

  console.log('Adding a new item...');
  return new Promise((resolve, reject) => {
    DB.put(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        addInfoToResponse();
        resolve({
          success: data,
        });
      }
    });
  });
}

wallet.prototype.addNewWallet = addNewWallet;
// Export object
module.exports = new Helper();
