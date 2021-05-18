module.exports.createParameter = (pk, startsWithDate, endsWithDate) => ({
  TableName: process.env.TABLE_NAME,
  KeyConditionExpression: 'pk = :pk and sk BETWEEN :bt1 AND :bt2',
  ExpressionAttributeValues: {
    ':pk': pk,
    ':bt1': `Category#${startsWithDate}`,
    ':bt2': `Category#${endsWithDate}`,
  },
  ProjectionExpression:
        'pk, sk, FetchCategory_name, FetchCategory_total, FetchCategory_type',
});
