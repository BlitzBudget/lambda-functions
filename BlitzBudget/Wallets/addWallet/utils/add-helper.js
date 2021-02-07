
async function handleAddNewWallet(event, userId, currency, walletName) {
    await addNewWallet(event, userId, currency, walletName).then(function () {
        console.log("successfully saved the new wallet");
    }, function (err) {
        throw new Error("Unable to add the wallet " + err);
    });
}