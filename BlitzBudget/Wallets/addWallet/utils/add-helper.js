function AddHelper() {}

const addWallet = require('../add/wallet');

async function handleAddNewWallet(event, userId, currency, walletName) {
  await addWallet.addNewWallet(event, userId, currency, walletName).then(
    () => {
      console.log('successfully saved the new wallet');
    },
    (err) => {
      throw new Error(`Unable to add the wallet ${err}`);
    },
  );
}

AddHelper.prototype.handleAddNewWallet = handleAddNewWallet;
// Export object
module.exports = new AddHelper();
