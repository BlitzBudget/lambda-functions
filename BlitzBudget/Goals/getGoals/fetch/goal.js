var goal = function () {};

// Get goal Item
goal.prototype.getGoalItem = function getGoalItem(
  walletId,
  docClient,
  goalData
) {
  var params = createParameter();

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, function (err, data) {
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

  function organizeRetrievedItems(data) {
    console.log('data retrieved - Goal %j', data.Count);
    if (data.Items) {
      for (const goalObj of data.Items) {
        goalObj.goalId = goalObj.sk;
        goalObj.walletId = goalObj.pk;
        delete goalObj.sk;
        delete goalObj.pk;
      }
    }
    goalData['Goal'] = data.Items;
  }

  function createParameter() {
    return {
      TableName: 'blitzbudget',
      KeyConditionExpression: 'pk = :walletId and begins_with(sk, :items)',
      ExpressionAttributeValues: {
        ':walletId': walletId,
        ':items': 'Goal#',
      },
      ProjectionExpression:
        'preferable_target_date, target_id, target_type, goal_type, monthly_contribution, sk, pk, final_amount',
    };
  }
};

// Export object
module.exports = new goal();
