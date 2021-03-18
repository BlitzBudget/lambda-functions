const constants = require('../constants/constant');

module.exports.createParameters = (pk, startsWithDate, endsWithDate) => ({
  TableName: constants.TABLE_NAME,
  KeyConditionExpression: 'pk = :pk and sk BETWEEN :bt1 AND :bt2',
  ExpressionAttributeValues: {
    ':pk': pk,
    ':bt1': `Category#${startsWithDate}`,
    ':bt2': `Category#${endsWithDate}`,
  },
  ProjectionExpression:
        'pk, sk, category_name, category_total, category_type',
});
