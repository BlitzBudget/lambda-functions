const Budget = () => {};

const budgetParameter = require('../create-parameter/budget');

// Get Budget Item
Budget.prototype.getBudgetData = async (
  walletId,
  startsWithDate,
  endsWithDate,
  documentClient,
) => {
  const params = budgetParameter.createParameters(walletId, startsWithDate, endsWithDate);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  return {
    Budget: response.Items,
  };
};

// Export object
module.exports = new Budget();
