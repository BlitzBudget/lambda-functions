function FetchBudget() {}

const budget = require('../create-parameter/budget');

// Get all budget Items
FetchBudget.prototype.getBudgetItems = async (walletId, currentPeriod, documentClient) => {
  const params = budget.createParameter(walletId, currentPeriod);

  // Call DynamoDB to read the item from the table

  const response = await documentClient.query(params).promise();
  return response;
};

// Export object
module.exports = new FetchBudget();
