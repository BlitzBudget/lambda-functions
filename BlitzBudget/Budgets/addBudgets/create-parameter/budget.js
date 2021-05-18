module.exports.createParameter = (event, todayAsDate) => ({
  TableName: process.env.TABLE_NAME,
  KeyConditionExpression: 'pk = :pk AND begins_with(sk, :items)',
  ExpressionAttributeValues: {
    ':pk': event['body-json'].walletId,
    ':items': `Budget#${todayAsDate.getFullYear()}-${(`0${todayAsDate.getMonth() + 1}`).slice(-2)}`,
  },
  ProjectionExpression: 'category, date_meant_for, sk, pk',
});
