const FetchGoal = () => {};

const constants = require('../constants/constant');

// Get goal Item
FetchGoal.prototype.getGoalItem = function getGoalItem(
  walletId,
  docClient,
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

  function createParameter() {
    return {
      TableName: constants.TABLE_NAME,
      KeyConditionExpression: 'pk = :walletId and begins_with(sk, :items)',
      ExpressionAttributeValues: {
        ':walletId': walletId,
        ':items': 'Goal#',
      },
      ProjectionExpression:
        'preferable_target_date, target_id, target_type, goal_type, monthly_contribution, sk, pk, final_amount',
    };
  }

  const params = createParameter();

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        organizeRetrievedItems(data);
        resolve({
          Goal: data.Items,
        });
      }
    });
  });
};

// Export object
module.exports = new FetchGoal();
