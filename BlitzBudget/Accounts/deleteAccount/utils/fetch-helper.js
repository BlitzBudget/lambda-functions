const recurringTransaction = require('../fetch/recurring-transactions');
const transaction = require('../fetch/transactions');

async function fetchTransactionDataForAccount(
  walletId,
  documentClient,
) {
  let result;
  const events = [];
  events.push(transaction.getTransactionItems(walletId, documentClient));
  events.push(recurringTransaction.getRecurringTransactionItems(walletId, documentClient));

  await Promise.all(events).then(
    (response) => {
      console.log('successfully fetched all the items');
      result = response;
    },
    (err) => {
      throw new Error(`Unable to delete the account ${err}`);
    },
  );
  return result;
}

module.exports.fetchTransactionDataForAccount = fetchTransactionDataForAccount;
