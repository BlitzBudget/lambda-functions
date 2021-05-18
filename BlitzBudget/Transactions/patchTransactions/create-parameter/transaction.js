module.exports.createParameter = (event, updateExp, expAttrNames, expAttrVal) => ({
  TableName: process.env.TABLE_NAME,
  Key: {
    pk: event['body-json'].walletId,
    sk: event['body-json'].transactionId,
  },
  UpdateExpression: updateExp,
  ExpressionAttributeNames: expAttrNames,
  ExpressionAttributeValues: expAttrVal,
  ReturnValues: 'ALL_NEW',
});
