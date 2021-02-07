
async function handleFetchWallet(event, walletData) {
    await getWalletItem(event['body-json'].userId, walletData).then(function () {
      console.log("Successfully retrieved all wallet information");
    }, function (err) {
      throw new Error("Unable error occured while fetching the Wallet " + err);
    });
  }
  