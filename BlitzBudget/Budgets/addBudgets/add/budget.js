function AddBudget() {}

const budgetParameter = require('../create-parameter/add-budget');

AddBudget.prototype.addNewBudget = async (event, today, documentClient) => {
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
