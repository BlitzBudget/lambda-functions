var fetchTransaction = function () {};

// Get all transaction Items
fetchTransaction.prototype.getTransactionItems = (
  walletId,
  currentPeriod,
  DB
) => {
  var params = {
    TableName: 'blitzbudget',
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': walletId,
      ':items': 'Transaction#' + currentPeriod,
    },
    ProjectionExpression:
      'amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags',
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

var fetchTransaction = function () {};
