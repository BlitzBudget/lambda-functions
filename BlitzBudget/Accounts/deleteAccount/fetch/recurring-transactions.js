const RecurringTransaction = () => {};

// Get all transaction Items
RecurringTransaction.prototype.getRecurringTransactionItems = async (
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
  const response = await DB.query(params).promise();
  return response;
};

// Export object
module.exports = new RecurringTransaction();
