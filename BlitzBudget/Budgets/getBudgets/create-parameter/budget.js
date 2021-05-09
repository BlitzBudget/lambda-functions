const constants = require('../constants/constant');

module.exports.createParameter = (walletId, startsWithDate, endsWithDate) => ({
  TableName: constants.TABLE_NAME,
  KeyConditionExpression: 'pk = :pk AND sk BETWEEN :bt1 AND :bt2',
  ExpressionAttributeValues: {
    ':pk': walletId,
    ':bt1': `Budget#${startsWithDate}`,
    ':bt2': `Budget#${endsWithDate}`,
  },
  ProjectionExpression: 'category, planned, sk, pk',
});
