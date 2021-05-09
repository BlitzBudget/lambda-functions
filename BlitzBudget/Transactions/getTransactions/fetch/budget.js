function FetchBudget() {}

const budgetParameter = require('../create-parameter/budget');

// Get Budget Item
async function getBudgetsData(walletId, startsWithDate, endsWithDate, documentClient) {
  const params = budgetParameter.createParameter(walletId, startsWithDate, endsWithDate);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  return {
    Budget: response.Items,
  };
}

FetchBudget.prototype.getBudgetsData = getBudgetsData;
// Export object
module.exports = new FetchBudget();
