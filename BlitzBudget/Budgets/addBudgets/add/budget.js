const AddBudget = () => {};

AddBudget.prototype.addNewBudget = async (event, docClient) => {
  const today = new Date();
  today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
  today.setMonth(
    parseInt(event['body-json'].dateMeantFor.substring(10, 12), 10) - 1,
  );
  const randomValue = `Budget#${today.toISOString()}`;

  const params = {
    TableName: 'blitzbudget',
    Item: {
      pk: event['body-json'].walletId,
      sk: randomValue,
      category: event['body-json'].category,
      planned: event['body-json'].planned,
      auto_generated: false,
      date_meant_for: event['body-json'].dateMeantFor,
      creation_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    },
  };

  console.log('Adding a new item...');

  const response = await docClient.put(params).promise();

  return {
    success: response,
    budgetId: randomValue,
  };
};

module.exports = new AddBudget();
