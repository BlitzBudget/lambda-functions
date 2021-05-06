function FetchHelper() {}

const budget = require('../fetch/budget');
const transaction = require('../fetch/transaction');

async function fetchAllItemsToDelete(
  walletId,
  curentPeriod,
  documentClient,
) {
  const events = [];
  let response;

  events.push(transaction.getTransactionItems(walletId, curentPeriod, documentClient));
  events.push(budget.getBudgetItems(walletId, curentPeriod, documentClient));
  await Promise.all(events).then(
    (result) => {
      console.log('successfully fetched all the items ');
      response = result;
    },
    (err) => {
      throw new Error(`Unable to delete the categories ${err}`);
    },
  );

  if (response[0].Count === 0 && response[1].Count === 0) {
    console.log('There are no items to delete for the wallet %j', walletId);
  }
  return response;
}

FetchHelper.prototype.fetchAllItemsToDelete = fetchAllItemsToDelete;

// Export object
module.exports = new FetchHelper();
