module.exports.createParameter = (pk, startsWithDate, endsWithDate) => ({
  TableName: process.env.TABLE_NAME,
  KeyConditionExpression: 'pk = :pk and sk BETWEEN :bt1 AND :bt2',
  ExpressionAttributeValues: {
    ':pk': pk,
    ':bt1': `Transaction#${startsWithDate}`,
    ':bt2': `Transaction#${endsWithDate}`,
  },
  ProjectionExpression:
        'amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags',
  ScanIndexForward: false,
});
