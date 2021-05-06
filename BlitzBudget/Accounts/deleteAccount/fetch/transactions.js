function Transaction() {}

const transaction = require('../create-parameter/recurring-transaction');

// Get all Transaction Items
Transaction.prototype.getTransactionItems = async (walletId, documentClient) => {
  const params = transaction.createParameter(walletId);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  return response;
};

// Export object
module.exports = new Transaction();
