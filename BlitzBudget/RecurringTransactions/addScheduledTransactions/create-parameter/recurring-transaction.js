const constants = require('../constants/constant');

module.exports.createParameter = (walletId, sk, futureTransactionCreationDate) => ({
  TableName: constants.TABLE_NAME,
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
