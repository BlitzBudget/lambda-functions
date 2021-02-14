var updateHelper = function () {};

const recurringTransaction = require('../update/recurring-transaction');

/*
 * Update recurring transactions
 */
async function updateRecurringTransaction(
  walletId,
  recurringTransactionsId,
  futureTransactionCreationDate,
  DB
) {
  events.push(
    recurringTransaction.updateRecurringTransactionsData(
      walletId,
      recurringTransactionsId,
      futureTransactionCreationDate,
      DB
    )
  );

  await Promise.all(events).then(
    function () {
      console.log(
        'Successfully updated the recurring transactions field %j',
        futureTransactionCreationDate
      );
    },
    function (err) {
      throw new Error(
        'Unable to update the recurring transactions field ' + err
      );
    }
  );
}

updateHelper.prototype.updateRecurringTransaction = updateRecurringTransaction;
// Export object
module.exports = new updateHelper();
