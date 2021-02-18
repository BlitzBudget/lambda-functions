const FetchHelper = () => {};

const budget = require('../fetch/budget');
const transaction = require('../fetch/transaction');

async function fetchAllItemsToDelete(
  walletId,
  curentPeriod,
  DB,
) {
  const events = [];
  let result;
  events.push(transaction.getTransactionItems(walletId, curentPeriod, DB));
  events.push(budget.getBudgetItems(walletId, curentPeriod, DB));

  await Promise.all(events).then(
    (res) => {
      console.log('successfully fetched all the items ');
      result = res;
    },
    (err) => {
      throw new Error(`Unable to delete the categories ${err}`);
    },
  );

  if (result[0].Count === 0 && result[1].Count === 0) {
    console.log('There are no items to delete for the wallet %j', walletId);
  }
  return { result, events };
}

FetchHelper.prototype.fetchAllItemsToDelete = fetchAllItemsToDelete;

// Export object
module.exports = new FetchHelper();
