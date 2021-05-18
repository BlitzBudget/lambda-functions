module.exports.createParameter = (walletId) => ({
  TableName: process.env.TABLE_NAME,
  KeyConditionExpression: 'pk = :walletId',
  ExpressionAttributeValues: {
    ':walletId': walletId,
  },
  ProjectionExpression: 'sk',
});
