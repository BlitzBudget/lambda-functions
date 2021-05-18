module.exports.createParameter = (
  event,
  updateExpression,
  expressionAttributeNames,
  expAttributeValue,
) => ({
  TableName: process.env.TABLE_NAME,
  Key: {
    pk: event['body-json'].walletId,
    sk: event['body-json'].budgetId,
  },
  UpdateExpression: updateExpression,
  ExpressionAttributeNames: expressionAttributeNames,
  ExpressionAttributeValues: expAttributeValue,
});
