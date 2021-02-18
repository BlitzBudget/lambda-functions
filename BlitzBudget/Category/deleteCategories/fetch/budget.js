const FetchBudget = () => {};

// Get all budget Items
FetchBudget.prototype.getBudgetItems = (walletId, currentPeriod, DB) => {
  const params = {
    TableName: 'blitzbudget',
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': walletId,
      ':items': `Budget#${currentPeriod}`,
    },
    ProjectionExpression: 'category, planned, sk, pk',
  };

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    DB.query(params, (err, data) => {
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

// Export object
module.exports = new FetchBudget();
