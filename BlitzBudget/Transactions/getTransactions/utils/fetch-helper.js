
async function fetchAllRelevantItems(events, walletId, startsWithDate, endsWithDate, docClient, snsEvents) {
    events.push(getTransactionItem(walletId, startsWithDate, endsWithDate, docClient));
    events.push(getBudgetsItem(walletId, startsWithDate, endsWithDate, docClient));
    events.push(getCategoryData(walletId, startsWithDate, endsWithDate, docClient));
    events.push(getBankAccountData(walletId, docClient));
    events.push(getDateData(walletId, startsWithDate.substring(0, 4), docClient));
    events.push(getRecurringTransactions(walletId, docClient, snsEvents, sns));
    await Promise.all(events).then(function () {
        console.log("Successfully fetched all the relevant information");
    }, function (err) {
        throw new Error("Unable error occured while fetching the Budget " + err);
    });
}


async function fetchWalletItem(walletId, userId, docClient) {
    if (isEmpty(walletId) && isNotEmpty(userId)) {
        await getWalletsData(userId, docClient).then(function (result) {
            walletId = result.Wallet[0].walletId;
            console.log("retrieved the wallet for the item ", walletId);
        }, function (err) {
            throw new Error("Unable error occured while fetching the transaction " + err);
        });
    }
    return walletId;
}
