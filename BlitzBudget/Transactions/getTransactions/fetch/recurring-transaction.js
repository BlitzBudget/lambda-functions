const RecurringTransaction = () => {};

const recurringTransactionParameter = require('../create-parameter/recurring-transaction');

const createTransactionSNS = require('../sns/create-transaction');

// Get Budget Item
async function getRecurringTransactions(walletId, documentClient, snsEvents, sns) {
  function organizeRecurringTransactionItem(data) {
    console.log('data retrieved - RecurringTransactions ', data.Count);
    const today = new Date();
    Object.keys(data.Items).forEach((recurringTransaction) => {
      const scheduled = new Date(recurringTransaction.next_scheduled);
      if (scheduled < today) {
        snsEvents.push(createTransactionSNS.markTransactionForCreation(recurringTransaction, sns));
      }
      const rt = recurringTransaction;
      rt.recurringTransactionsId = recurringTransaction.sk;
      rt.walletId = recurringTransaction.pk;
      delete rt.sk;
      delete rt.pk;
    });
  }

  const params = recurringTransactionParameter.createParameter(walletId);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  organizeRecurringTransactionItem(response);
  return ({
    RecurringTransactions: response.Items,
  });
}

RecurringTransaction.prototype.getRecurringTransactions = getRecurringTransactions;
// Export object
module.exports = new RecurringTransaction();
