var fetchBudget = function () {};

// Get all budget Items
fetchBudget.prototype.getBudgetItems = (walletId, currentPeriod, DB) => {
  var params = {
    TableName: 'blitzbudget',
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': walletId,
      ':items': 'Budget#' + currentPeriod,
    },
    ProjectionExpression: 'category, planned, sk, pk',
  };

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    DB.query(params, function (err, data) {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('data retrieved ', JSON.stringify(data.Items));
        resolve(data);
      }
    });
  });
};

var fetchBudget = function () {};
