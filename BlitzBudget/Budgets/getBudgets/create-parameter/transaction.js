const constants = require('../constants/constant');

module.exports.createParameters = (pk, startsWithDate, endsWithDate) => ({
  TableName: constants.TABLE_NAME,
  KeyConditionExpression: 'pk = :pk and sk BETWEEN :bt1 AND :bt2',
  ExpressionAttributeValues: {
    ':pk': pk,
    ':bt1': `Transaction#${startsWithDate}`,
    ':bt2': `Transaction#${endsWithDate}`,
  },
  ProjectionExpression: 'amount, description, category, recurrence, sk, pk',
});
