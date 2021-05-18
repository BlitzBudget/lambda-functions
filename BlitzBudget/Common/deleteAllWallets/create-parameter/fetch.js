module.exports.createParameter = (userId) => ({
  TableName: process.env.TABLE_NAME,
  KeyConditionExpression: 'pk = :userId',
  ExpressionAttributeValues: {
    ':userId': userId,
  },
  ProjectionExpression: 'sk',
});
