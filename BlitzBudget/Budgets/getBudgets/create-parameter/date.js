module.exports.createParameter = (pk, year) => ({
  TableName: process.env.TABLE_NAME,
  KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
  ExpressionAttributeValues: {
    ':pk': pk,
    ':items': `Date#${year}`,
  },
  ProjectionExpression: 'pk, sk, income_total, expense_total, balance',
});
