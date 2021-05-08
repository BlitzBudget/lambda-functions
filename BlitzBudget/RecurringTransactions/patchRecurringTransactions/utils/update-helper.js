function UpdateHelper() {}

const patchRecurringTransaction = require('../patch/recurring-transactions');

async function updateRecurringTransaction(events, event, documentClient) {
  const allResponses = {};
  events.push(
    patchRecurringTransaction.updatingRecurringTransactions(event, documentClient),
  );
  await Promise.all(events).then(
    (response) => {
      if (events.length === 1) {
        allResponses.Transaction = response[0].Transaction;
      } else if (events.length === 2) {
        allResponses.Category = response[0].Category;
        allResponses.Transaction = response[1].Transaction;
      }
      console.log('successfully saved the new transactions');
    },
    (err) => {
      throw new Error(`Unable to add the transactions ${err}`);
    },
  );

  return allResponses;
}

UpdateHelper.prototype.updateRecurringTransaction = updateRecurringTransaction;
// Export object
module.exports = new UpdateHelper();
