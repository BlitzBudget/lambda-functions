const constants = require('../constants/constant');

module.exports.createParameter = (walletId) => ({
  TableName: constants.TABLE_NAME,
  KeyConditionExpression: 'pk = :walletId',
  ExpressionAttributeValues: {
    ':walletId': walletId,
  },
  ProjectionExpression: 'sk',
});
