module.exports.createParameter = (pk, sk, difference, income, expense) => ({
  TableName: process.env.TABLE_NAME,
  Key: {
    pk,
    sk,
  },
  UpdateExpression: 'set balance = balance + :ab, income_total = income_total + :it, expense_total = expense_total + :et',
  ConditionExpression: 'attribute_exists(balance)',
  ExpressionAttributeValues: {
    ':ab': difference,
    ':it': income,
    ':et': expense,
  },
  ReturnValues: 'NONE',
});
