module.exports.createParameter = (pk, sk, difference) => ({
  TableName: process.env.TABLE_NAME,
  Key: {
    pk,
    sk,
  },
  UpdateExpression: 'set category_total = category_total + :ab',
  ConditionExpression: 'attribute_exists(category_total)',
  ExpressionAttributeValues: {
    ':ab': difference,
  },
  ReturnValues: 'NONE',
});
