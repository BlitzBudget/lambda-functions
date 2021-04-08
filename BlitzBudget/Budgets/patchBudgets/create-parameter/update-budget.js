module.exports.createParameter = (
  event,
  updateExpression,
  expressionAttributeNames,
  expAttributeValue,
) => ({
  TableName: 'blitzbudget',
  Key: {
    pk: event['body-json'].walletId,
    sk: event['body-json'].budgetId,
  },
  UpdateExpression: updateExpression,
  ExpressionAttributeNames: expressionAttributeNames,
  ExpressionAttributeValues: expAttributeValue,
});
