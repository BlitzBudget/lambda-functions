var transaction = function () {};

// Get Transaction Item
function getTransactionItems(pk, startsWithDate, endsWithDate, docClient) {
  var params = createParameters();

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, function (err, data) {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('data retrieved - Transactions %j', data.Count);
        overviewData['Transaction'] = data.Items;
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
      ProjectionExpression:
        'amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags',
      ScanIndexForward: false,
    };
  }
}

transaction.prototype.getTransactionItems = getTransactionItems;
// Export object
module.exports = new transaction();
