function FetchHelper() {}

const fetchItems = require('../fetch/items');

async function fetchAllItemsForWallet(walletId, DB) {
  let result;
  await fetchItems.getAllItems(walletId, DB).then(
    (response) => {
      console.log('successfully fetched all the items ', response);
      result = response;
    },
    (err) => {
      throw new Error(`Unable to delete the goals ${err}`);
    },
  );
  return result;
}

FetchHelper.prototype.fetchAllItemsForWallet = fetchAllItemsForWallet;

// Export object
module.exports = new FetchHelper();
