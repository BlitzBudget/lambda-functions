const constants = require('../constants/constant');

module.exports.createParameters = (pk, year) => ({
  TableName: constants.TABLE_NAME,
  KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
  ExpressionAttributeValues: {
    ':pk': pk,
    ':items': `Date#${year}`,
  },
  ProjectionExpression: 'pk, sk, income_total, expense_total, balance',
});
