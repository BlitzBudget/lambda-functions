const FetchBudget = () => {};

const budgetParameter = require('../create-parameter/budget');

// Get Budget Item
async function getBudgetsItem(walletId, startsWithDate, endsWithDate, documentClient) {
  const params = budgetParameter.createParameters(walletId, startsWithDate, endsWithDate);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  return {
    Budget: response.Items,
  };
}

FetchBudget.prototype.getBudgetsItem = getBudgetsItem;
// Export object
module.exports = new FetchBudget();
