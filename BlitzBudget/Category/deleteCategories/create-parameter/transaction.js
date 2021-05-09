const constants = require('../constants/constant');

module.exports.createParameter = (walletId, currentPeriod) => ({
  TableName: constants.TABLE_NAME,
  KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
  ExpressionAttributeValues: {
    ':pk': walletId,
    ':items': `Transaction#${currentPeriod}`,
  },
  ProjectionExpression: 'amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags',
});
