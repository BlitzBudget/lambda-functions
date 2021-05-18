module.exports.createParameter = (walletId) => ({
  TableName: process.env.TABLE_NAME,
  KeyConditionExpression: 'pk = :walletId AND begins_with(sk, :items)',
  ExpressionAttributeValues: {
    ':walletId': walletId,
    ':items': 'RecurringTransactions#',
  },
  ProjectionExpression:
        'sk, pk, amount, description, category, recurrence, account, next_scheduled, tags, creation_date, category_type, category_name',
});
