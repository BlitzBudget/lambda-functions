const PatchGoal = () => {};

const AWS = require('aws-sdk');
const util = require('../utils/util');
const constants = require('../constants/constant');
const goalParameter = require('../create-parameter/goal');

// Load the AWS SDK for Node.js
// Set the region
AWS.config.update({ region: constants.EU_WEST_ONE });

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

async function updatingGoals(event) {
  const params = goalParameter.createParameter(event);

  if (util.isEmpty(params)) {
    return undefined;
  }

  console.log('Updating an item...');
  const response = await documentClient.update(params).promise();
  return response;
}

PatchGoal.prototype.updatingGoals = updatingGoals;

// Export object
module.exports = new PatchGoal();
