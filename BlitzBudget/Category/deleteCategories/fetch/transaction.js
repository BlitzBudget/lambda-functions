const FetchTransaction = () => {};

const transaction = require('../create-parameter/transaction');

// Get all transaction Items
FetchTransaction.prototype.getTransactionItems = async (
  walletId,
  currentPeriod,
  DB,
) => {
  const params = transaction.createParameter(walletId, currentPeriod);

  // Call DynamoDB to read the item from the table

  const response = await DB.query(params).promise();
  return response;
};

// Export object
module.exports = new FetchTransaction();
