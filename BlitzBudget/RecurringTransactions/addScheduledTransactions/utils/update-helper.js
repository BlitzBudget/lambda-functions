const UpdateHelper = () => {};

const recurringTransaction = require('../update/recurring-transaction');

/*
 * Update recurring transactions
 */
async function updateRecurringTransaction(
  walletId,
  recurringTransactionsId,
  futureTransactionCreationDate,
  DB,
  events,
) {
  events.push(
    recurringTransaction.updateRecurringTransactionsData(
      walletId,
      recurringTransactionsId,
      futureTransactionCreationDate,
      DB,
    ),
  );

  await Promise.all(events).then(
    () => {
      console.log(
        'Successfully updated the recurring transactions field %j',
        futureTransactionCreationDate,
      );
    },
    (err) => {
      throw new Error(
        `Unable to update the recurring transactions field ${err}`,
      );
    },
  );
}

UpdateHelper.prototype.updateRecurringTransaction = updateRecurringTransaction;
// Export object
module.exports = new UpdateHelper();
