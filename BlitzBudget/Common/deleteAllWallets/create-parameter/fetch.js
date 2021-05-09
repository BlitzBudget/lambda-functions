const constants = require('../constants/constant');

module.exports.createParameter = (userId) => ({
  TableName: constants.TABLE_NAME,
  KeyConditionExpression: 'pk = :userId',
  ExpressionAttributeValues: {
    ':userId': userId,
  },
  ProjectionExpression: 'sk',
});
