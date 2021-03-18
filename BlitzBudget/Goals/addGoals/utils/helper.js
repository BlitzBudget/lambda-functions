const Helper = () => {};

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const constants = require('../constants/constant');
const goalParameter = require('../create-parameter/goal');
// Set the region
AWS.config.update({
  region: constants.EU_WEST_ONE,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

async function addNewGoals(event) {
  const today = new Date();
  const randomValue = `Goal#${today.toISOString()}`;

  const params = goalParameter.createParameter(randomValue, event);

  console.log('Adding a new item...');

  const response = await documentClient.put(params).promise();

  return {
    Goal: response,
  };
}

const handleAddNewGoal = async (event) => {
  await addNewGoals(event).then(
    () => {
      console.log('successfully saved the new goals');
    },
    (err) => {
      throw new Error(`Unable to add the goals ${err}`);
    },
  );
};

Helper.prototype.handleAddNewGoal = handleAddNewGoal;
// Export object
module.exports = new Helper();
