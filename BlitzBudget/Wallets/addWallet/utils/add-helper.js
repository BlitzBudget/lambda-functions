var addHelper = function () { };

const addWallet = require('../add/wallet');

async function handleAddNewWallet(event, userId, currency, walletName) {
    await addWallet.addNewWallet(event, userId, currency, walletName).then(function () {
        console.log("successfully saved the new wallet");
    }, function (err) {
        throw new Error("Unable to add the wallet " + err);
    });
}

addHelper.prototype.handleAddNewWallet = handleAddNewWallet;
// Export object
module.exports = new addHelper(); 