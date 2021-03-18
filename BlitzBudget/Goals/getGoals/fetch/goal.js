const FetchGoal = () => {};

const goalParameter = require('../create-parameter/goal');

// Get goal Item
FetchGoal.prototype.getGoalItem = async function getGoalItem(
  walletId,
  documentClient,
) {
  function organizeRetrievedItems(data) {
    console.log('data retrieved - Goal %j', data.Count);
    if (data.Items) {
      Object.keys(data.Items).forEach((goalObj) => {
        const goal = goalObj;
        goal.goalId = goalObj.sk;
        goal.walletId = goalObj.pk;
        delete goal.sk;
        delete goal.pk;
      });
    }
  }

  const params = goalParameter.createParameter(walletId);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  organizeRetrievedItems(response);
  return {
    Goal: response.Items,
  };
};

// Export object
module.exports = new FetchGoal();
