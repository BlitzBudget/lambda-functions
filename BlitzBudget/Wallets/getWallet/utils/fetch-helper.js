const FetchHelper = () => {};

const fetchWallet = require('../fetch/wallet');

async function handleFetchWallet(event, walletData) {
  await fetchWallet.getWalletItem(event['body-json'].userId, walletData).then(
    () => {
      console.log('Successfully retrieved all wallet information');
    },
    (err) => {
      throw new Error(`Unable error occured while fetching the Wallet ${err}`);
    },
  );
}

FetchHelper.prototype.handleFetchWallet = handleFetchWallet;
// Export object
module.exports = new FetchHelper();
