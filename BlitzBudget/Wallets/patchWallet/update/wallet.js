const UpdateHelper = () => {};

const AWS = require('aws-sdk');
const constants = require('../constants/constant');
const walletParameter = require('../create-parameter/wallet');

// Load the AWS SDK for Node.js
// Set the region
AWS.config.update({
  region: constants.EU_WEST_ONE,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

async function updatingItem(event) {
  const params = walletParameter.createParameters(event);

  console.log('Updating an item...');
  const response = await documentClient.update(params).promise();
  return response;
}

UpdateHelper.prototype.updatingItem = updatingItem;
// Export object
module.exports = new UpdateHelper();
