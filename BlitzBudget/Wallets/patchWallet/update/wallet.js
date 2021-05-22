function UpdateWallet() { }

const AWS = require('aws-sdk');
const walletParameter = require('../create-expression/wallet');

// Load the AWS SDK for Node.js
// Set the region
AWS.config.update({
  region: process.env.AWS_LAMBDA_REGION,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

async function updatingItem(event) {
  const params = walletParameter.createExpression(event);

  console.log('Updating an item...');
  const response = await documentClient.update(params).promise();
  return response;
}

UpdateWallet.prototype.updatingItem = updatingItem;
// Export object
module.exports = new UpdateWallet();
