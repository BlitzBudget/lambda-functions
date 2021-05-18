function Helper() {}

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const constants = require('../constants/constant');
const addGoal = require('../add/goal');
// Set the region
AWS.config.update({
  region: constants.AWS_LAMBDA_REGION,
});

// Create the DynamoDB service object
const dynamoDB = new AWS.DynamoDB();
const documentClient = new dynamoDB.DocumentClient();

const handleAddNewGoal = async (event) => {
  await addGoal.addNewGoals(event, documentClient).then(
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
