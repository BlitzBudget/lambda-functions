const TransactionFunction = () => {};

// Get Transaction Item
TransactionFunction.prototype.getTransactionsData = (
  pk,
  startsWithDate,
  endsWithDate,
  docClient,
) => {
  function createParameters() {
    return {
      TableName: 'blitzbudget',
      KeyConditionExpression: 'pk = :pk and sk BETWEEN :bt1 AND :bt2',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':bt1': `Transaction#${startsWithDate}`,
        ':bt2': `Transaction#${endsWithDate}`,
      },
      ProjectionExpression: 'amount, description, category, recurrence, sk, pk',
    };
  }

  const params = createParameters();

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('data retrieved - Transactions %j', data.Count);
        resolve({
          Transaction: data.Items,
        });
      }
    });
  });
};

// Export object
module.exports = new TransactionFunction();
