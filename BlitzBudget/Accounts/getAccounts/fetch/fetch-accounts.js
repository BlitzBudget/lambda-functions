// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const constants = require('../constants/constant');
// Set the region
AWS.config.update({
  region: constants.EU_WEST_ONE,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: constants.EU_WEST_ONE,
});
const FetchAccounts = () => {};

async function getBankAccountItem(params) {
  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  return response;
}

// Get BankAccount Item
FetchAccounts.prototype.getBankAccountItem = getBankAccountItem;

// Export object
module.exports = new FetchAccounts();
