module.exports.createParameter = (pk, sk, balance) => ({
  TableName: process.env.TABLE_NAME,
  Key: {
    pk,
    sk,
  },
  UpdateExpression: 'set account_balance = account_balance + :ab',
  ConditionExpression: 'attribute_exists(account_balance)',
  ExpressionAttributeValues: {
    ':ab': balance,
  },
  ReturnValues: 'UPDATED_NEW',
});
