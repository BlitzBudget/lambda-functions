const RecurringTransaction = () => {};

// Get all transaction Items
RecurringTransaction.prototype.getRecurringTransactionItems = (
  walletId,
  DB,
) => {
  const params = {
    TableName: 'blitzbudget',
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': walletId,
      ':items': 'RecurringTransactions#',
    },
    ProjectionExpression:
      'amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags',
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
module.exports = new RecurringTransaction();
