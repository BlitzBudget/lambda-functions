var budget = function () {};

// Get Budget Item
budget.prototype.getBudgetsItem = (today, event, docClient) => {
  var params = createParameters();

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, function (err, data) {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('data retrieved - Budget', data.Count);
        let matchingBudget;
        if (isNotEmpty(data.Items)) {
          for (const budgetItem of data.Items) {
            if (
              isEqual(budgetItem.category, event['body-json'].category) &&
              isEqual(
                budgetItem['date_meant_for'],
                event['body-json'].dateMeantFor
              )
            ) {
              console.log(
                'Matching budget found with the same date and category %j',
                budgetItem.sk
              );
              matchingBudget = budgetItem;
            }
          }
        }

        resolve({Budget: matchingBudget});
      }
    });
  });

  function createParameters() {
    return {
      TableName: 'blitzbudget',
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :items)',
      ExpressionAttributeValues: {
        ':pk': event['body-json'].walletId,
        ':items':
          'Budget#' +
          today.getFullYear() +
          '-' +
          ('0' + (today.getMonth() + 1)).slice(-2),
      },
      ProjectionExpression: 'category, date_meant_for, sk, pk',
    };
  }
};

// Export object
module.exports = new budget();
