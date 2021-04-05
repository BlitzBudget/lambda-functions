const PatchRecurringTransaction = () => {};

const recurringTransactionParameter = require('../create-parameter/recurring-transaction');

async function updatingRecurringTransactions(event, documentClient) {
  const params = recurringTransactionParameter.createParameter(event);

  console.log('Updating an item...');
  const response = await documentClient.update(params).promise();

  return {
    Transaction: response,
  };
}

PatchRecurringTransaction.prototype.updatingRecurringTransactions = updatingRecurringTransactions;
// Export object
module.exports = new PatchRecurringTransaction();
