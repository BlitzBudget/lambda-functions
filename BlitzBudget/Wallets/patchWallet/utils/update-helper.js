function UpdateHelper() {}

const updateWallet = require('../update/wallet');

async function handleUpdateItems(event) {
  await updateWallet.updatingItem(event).then(
    () => {
      console.log('successfully saved the new goals');
    },
    (err) => {
      throw new Error(`Unable to save the changes to the wallet ${err}`);
    },
  );
}

UpdateHelper.prototype.handleUpdateItems = handleUpdateItems;
// Export object
module.exports = new UpdateHelper();
