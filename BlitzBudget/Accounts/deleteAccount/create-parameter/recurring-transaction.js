module.exports.createParameter = (walletId) => ({
  TableName: 'blitzbudget',
  KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
  ExpressionAttributeValues: {
    ':pk': walletId,
    ':items': 'RecurringTransactions#',
  },
  ProjectionExpression: 'amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags',
});
