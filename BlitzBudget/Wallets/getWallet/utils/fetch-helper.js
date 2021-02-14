var fetchHelper = function () {};

const fetchWallet = require('../fetch/wallet');

async function handleFetchWallet(event, walletData) {
  await fetchWallet.getWalletItem(event['body-json'].userId, walletData).then(
    function () {
      console.log('Successfully retrieved all wallet information');
    },
    function (err) {
      throw new Error('Unable error occured while fetching the Wallet ' + err);
    }
  );
}

fetchHelper.prototype.handleFetchWallet = handleFetchWallet;
// Export object
module.exports = new fetchHelper();
