module.exports.createParameter = (walletId, dateId) => ({
  TableName: process.env.TABLE_NAME,
  Key: {
    pk: walletId,
    sk: dateId,
  },
  UpdateExpression: 'set income_total = :r, expense_total=:p, balance=:a, creation_date = :c, updated_date = :u',
  ExpressionAttributeValues: {
    ':r': 0,
    ':p': 0,
    ':a': 0,
    ':c': new Date().toISOString(),
    ':u': new Date().toISOString(),
  },
  ReturnValues: 'ALL_NEW',
});
