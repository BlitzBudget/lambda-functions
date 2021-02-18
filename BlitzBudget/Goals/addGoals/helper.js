const Helper = () => {};

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient();

function addNewGoals(event) {
  const today = new Date();
  const randomValue = `Goal#${today.toISOString()}`;

  function createParameter() {
    return {
      TableName: 'blitzbudget',
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
  return new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        resolve({
          Goal: data,
        });
      }
    });
  });
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
