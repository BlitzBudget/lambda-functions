module.exports.createParameter = (walletId, sk, futureTransactionCreationDate) => ({
  TableName: process.env.TABLE_NAME,
  Key: {
    pk: walletId,
    sk,
  },
  UpdateExpression: 'set next_scheduled = :ns, updated_date = :u',
  ExpressionAttributeValues: {
    ':ns': futureTransactionCreationDate,
    ':u': new Date().toISOString(),
  },
  ReturnValues: 'ALL_NEW',
});
