const RecurringTransaction = () => {};

const recurringTransaction = require('../create-parameter/recurring-transaction');

// Get all transaction Items
RecurringTransaction.prototype.getRecurringTransactionItems = async (
  walletId,
  DB,
) => {
  const params = recurringTransaction.createParameter(walletId);

  // Call DynamoDB to read the item from the table
  const response = await DB.query(params).promise();
  return response;
};

// Export object
module.exports = new RecurringTransaction();
