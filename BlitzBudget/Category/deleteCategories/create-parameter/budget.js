module.exports.createParameter = (walletId, currentPeriod) => ({
  TableName: process.env.TABLE_NAME,
  KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
  ExpressionAttributeValues: {
    ':pk': walletId,
    ':items': `Budget#${currentPeriod}`,
  },
  ProjectionExpression: 'category, planned, sk, pk',
});
