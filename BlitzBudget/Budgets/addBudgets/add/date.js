const AddDate = () => {};

AddDate.prototype.createDateData = async (event, skForDate, documentClient) => {
  const params = {
    TableName: 'blitzbudget',
    Key: {
      pk: event['body-json'].walletId,
      sk: skForDate,
    },
    UpdateExpression:
      'set income_total = :r, expense_total=:p, balance=:a, creation_date = :c, updated_date = :u',
    ExpressionAttributeValues: {
      ':r': 0,
      ':p': 0,
      ':a': 0,
      ':c': new Date().toISOString(),
      ':u': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  };

  console.log('Adding a new item...');

  const response = await documentClient.update(params).promise();
  return {
    Date: response.Attributes,
  };
};

module.exports = new AddDate();
