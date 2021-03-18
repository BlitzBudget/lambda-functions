const constants = require('../constants/constant');

module.exports.createParameter = (pk, startsWithDate, endsWithDate) => ({
  TableName: constants.TABLE_NAME,
  KeyConditionExpression: 'pk = :pk and sk BETWEEN :bt1 AND :bt2',
  ExpressionAttributeValues: {
    ':pk': pk,
    ':bt1': `Date#${startsWithDate}`,
    ':bt2': `Date#${endsWithDate}`,
  },
  ProjectionExpression: 'pk, sk, income_total, expense_total, balance',
});
