function RecurringTransaction() {}

const recurringTransactionParameter = require('../create-parameter/recurring-transaction');
const organizeRecurringTransactions = require('../organize/recurring-transaction');

// Get Budget Item
async function getRecurringTransactions(walletId, documentClient, snsEvents, sns) {
  const params = recurringTransactionParameter.createParameter(walletId);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  organizeRecurringTransactions.organize(response, snsEvents, sns);
  return ({
    RecurringTransactions: response.Items,
  });
}

RecurringTransaction.prototype.getRecurringTransactions = getRecurringTransactions;
// Export object
module.exports = new RecurringTransaction();
