const FetchBudget = () => {};

const bankAccount = require('../create-parameter/bank-account');

// Get BankAccount Item
FetchBudget.prototype.getBankAccountItem = async (walletId, documentClient) => {
  const params = bankAccount.createParameter(walletId);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  return {
    Account: response.Items,
  };
};

// Export object
module.exports = new FetchBudget();
