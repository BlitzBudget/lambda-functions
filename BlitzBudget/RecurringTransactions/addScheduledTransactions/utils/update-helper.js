function UpdateHelper() {}

const recurringTransaction = require('../update/recurring-transaction');

/*
 * Update recurring transactions
 */
async function updateRecurringTransaction(
  walletId,
  recurringTransactionsId,
  futureTransactionCreationDate,
  documentClient,
  datesToCreateTransactions,
) {
  datesToCreateTransactions.push(
    recurringTransaction.updateRecurringTransactionsData(
      walletId,
      recurringTransactionsId,
      futureTransactionCreationDate,
      documentClient,
    ),
  );

  await Promise.all(datesToCreateTransactions).then(
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
