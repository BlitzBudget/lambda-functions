function PatchRecurringTransaction() {}

const recurringTransactionExpression = require('../create-expression/recurring-transaction');

async function updatingRecurringTransactions(event, documentClient) {
  const params = recurringTransactionExpression.createExpression(event);

  console.log('Updating an item...');
  const response = await documentClient.update(params).promise();

  return {
    Transaction: response.Attributes,
  };
}

PatchRecurringTransaction.prototype.updatingRecurringTransactions = updatingRecurringTransactions;
// Export object
module.exports = new PatchRecurringTransaction();
