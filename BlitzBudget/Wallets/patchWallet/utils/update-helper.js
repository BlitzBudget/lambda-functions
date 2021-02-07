var updateHelper = function () { };

const updateWallet = require('../update/wallet');

async function handleUpdateItems(event) {
    await updateWallet.updatingItem(event).then(function () {
        console.log("successfully saved the new goals");
    }, function (err) {
        throw new Error("Unable to save the changes to the wallet " + err);
    });
}

updateHelper.prototype.handleUpdateItems = handleUpdateItems;
// Export object
module.exports = new updateHelper();