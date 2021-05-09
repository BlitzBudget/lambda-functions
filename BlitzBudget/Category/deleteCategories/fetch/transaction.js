function FetchTransaction() {}

const transaction = require('../create-parameter/transaction');

// Get all transaction Items
FetchTransaction.prototype.getTransactionItems = async (
  walletId,
  currentPeriod,
  documentClient,
) => {
  const params = transaction.createParameter(walletId, currentPeriod);

  // Call DynamoDB to read the item from the table

  const response = await documentClient.query(params).promise();
  return response;
};

// Export object
module.exports = new FetchTransaction();
