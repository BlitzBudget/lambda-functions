const constants = require('../constants/constant');

module.exports.createParameter = (walletId, startsWithDate, endsWithDate) => ({
  TableName: constants.TABLE_NAME,
  KeyConditionExpression: 'pk = :walletId AND sk BETWEEN :bt1 AND :bt2',
  ExpressionAttributeValues: {
    ':walletId': walletId,
    ':bt1': `Budget#${startsWithDate}`,
    ':bt2': `Budget#${endsWithDate}`,
  },
  ProjectionExpression: 'category, planned, sk, pk',
});
