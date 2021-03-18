const UpdateHelper = () => {};

const patchRecurringTransaction = require('../patch/recurring-transactions');

async function updateRecurringTransaction(events, event, documentClient) {
  let allResponses;
  events.push(
    patchRecurringTransaction.updatingRecurringTransactions(event, documentClient),
  );
  await Promise.all(events).then(
    (response) => {
      allResponses = response;
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
