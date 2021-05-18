module.exports.createParameter = (pk, today) => ({
  TableName: process.env.TABLE_NAME,
  KeyConditionExpression: 'pk = :pk AND begins_with(sk, :items)',
  ExpressionAttributeValues: {
    ':pk': pk,
    ':items': `Date#${today.getFullYear()}-${(`0${today.getMonth() + 1}`).slice(-2)}`,
  },
  ProjectionExpression: 'pk, sk',
});
