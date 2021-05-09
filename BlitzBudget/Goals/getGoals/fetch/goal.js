function FetchGoal() {}

const goalParameter = require('../create-parameter/goal');
const organizeGoal = require('../organize/goal');

// Get goal Item
FetchGoal.prototype.getGoalData = async function getGoalItem(
  walletId,
  documentClient,
) {
  const params = goalParameter.createParameter(walletId);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  organizeGoal.organize(response);
  return {
    Goal: response.Items,
  };
};

// Export object
module.exports = new FetchGoal();
