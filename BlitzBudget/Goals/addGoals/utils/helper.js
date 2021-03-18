const Helper = () => {};

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const constants = require('../constants/constant');
// Set the region
AWS.config.update({
  region: constants.EU_WEST_ONE,
});

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient();

async function addNewGoals(event) {
  const today = new Date();
  const randomValue = `Goal#${today.toISOString()}`;

  function createParameter() {
    return {
      TableName: constants.TABLE_NAME,
      Item: {
        pk: event['body-json'].walletId,
        sk: randomValue,
        goal_type: event['body-json'].goalType,
        final_amount: event['body-json'].targetAmount,
        preferable_target_date: event['body-json'].targetDate,
        actual_target_date: event['body-json'].actualTargetDate,
        monthly_contribution: event['body-json'].monthlyContribution,
        target_id: event['body-json'].targetId,
        target_type: event['body-json'].targetType,
        creation_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
    };
  }

  const params = createParameter();

  console.log('Adding a new item...');

  const response = await docClient.put(params).promise();

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
