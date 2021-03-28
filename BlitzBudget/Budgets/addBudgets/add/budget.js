function AddBudget() {}

const budgetParameter = require('../create-parameter/add-budget');

AddBudget.prototype.addNewBudget = async (event, documentClient) => {
  const today = new Date();
  today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
  today.setMonth(
    parseInt(event['body-json'].dateMeantFor.substring(10, 12), 10) - 1,
  );
  const randomValue = `Budget#${today.toISOString()}`;
  const parameter = budgetParameter.createParameter(event, randomValue);

  console.log('Adding a new item...');

  const response = await documentClient.put(parameter).promise();

  return {
    success: response,
    budgetId: randomValue,
  };
};

module.exports = new AddBudget();
