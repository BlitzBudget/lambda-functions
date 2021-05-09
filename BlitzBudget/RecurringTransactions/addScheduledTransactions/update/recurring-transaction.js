function RecurringTransaction() {}

const recurringTransactionParameter = require('../create-parameter/recurring-transaction');

async function updateRecurringTransactionsData(
  walletId,
  sk,
  futureTransactionCreationDate,
  documentClient,
) {
  const params = recurringTransactionParameter.createParameter(
    walletId, sk, futureTransactionCreationDate,
  );

  console.log('Adding a new item...');
  const response = await documentClient.update(params).promise();
  return response.Attributes;
}

RecurringTransaction.prototype.updateRecurringTransactionsData = updateRecurringTransactionsData;
// Export object
module.exports = new RecurringTransaction();
