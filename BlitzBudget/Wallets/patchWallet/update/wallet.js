function UpdateWallet() {}

const AWS = require('aws-sdk');
const constants = require('../constants/constant');
const walletParameter = require('../create-expression/wallet');

// Load the AWS SDK for Node.js
// Set the region
AWS.config.update({
  region: constants.AWS_LAMBDA_REGION,
});

// Create the DynamoDB service object
const dynamoDB = new AWS.DynamoDB();
const documentClient = dynamoDB.DocumentClient();

async function updatingItem(event) {
  const params = walletParameter.createExpression(event);

  console.log('Updating an item...');
  const response = await documentClient.update(params).promise();
  return response;
}

UpdateWallet.prototype.updatingItem = updatingItem;
// Export object
module.exports = new UpdateWallet();
