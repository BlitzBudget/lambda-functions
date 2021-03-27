const constants = require('../constants/constant');

module.exports.createParameter = (walletId) => ({
  TableName: constants.TABLE_NAME,
  KeyConditionExpression: constants.KEY_CONDITION_EXPRESSION,
  ExpressionAttributeValues: {
    ':pk': walletId,
    ':items': 'Transaction#',
  },
  ProjectionExpression: constants.PROJECTION_EXPRESSION,
});
