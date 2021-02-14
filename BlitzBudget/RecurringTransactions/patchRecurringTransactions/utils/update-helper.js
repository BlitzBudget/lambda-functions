var updateHelper = function () {};

const patchRecurringTransaction = require('utils/update-helper');

async function updateRecurringTransaction(events, event, docClient) {
  events.push(
    patchRecurringTransaction.updatingRecurringTransactions(event, docClient)
  );
  await Promise.all(events).then(
    function () {
      console.log('successfully saved the new transactions');
    },
    function (err) {
      throw new Error('Unable to add the transactions ' + err);
    }
  );
}

updateHelper.prototype.updateRecurringTransaction = updateRecurringTransaction;
// Export object
module.exports = new updateHelper();
