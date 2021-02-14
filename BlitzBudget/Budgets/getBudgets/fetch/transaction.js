var transaction = function () {};

// Get Transaction Item
transaction.prototype.getTransactionsData = (
  pk,
  startsWithDate,
  endsWithDate,
  budgetData,
  docClient
) => {
  var params = createParameters();

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, function (err, data) {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('data retrieved - Transactions %j', data.Count);
        budgetData['Transaction'] = data.Items;
        resolve({
          Transaction: data.Items,
        });
      }
    });
  });

  function createParameters() {
    return {
      TableName: 'blitzbudget',
      KeyConditionExpression: 'pk = :pk and sk BETWEEN :bt1 AND :bt2',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':bt1': 'Transaction#' + startsWithDate,
        ':bt2': 'Transaction#' + endsWithDate,
      },
      ProjectionExpression: 'amount, description, category, recurrence, sk, pk',
    };
  }
};

// Export object
module.exports = new transaction();
