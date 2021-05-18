function FetchAccounts() {}

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({
  region: process.env.AWS_LAMBDA_REGION,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

async function getBankAccountItem(params) {
  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  return response;
}

// Get BankAccount Item
FetchAccounts.prototype.getBankAccountItem = getBankAccountItem;

// Export object
module.exports = new FetchAccounts();
