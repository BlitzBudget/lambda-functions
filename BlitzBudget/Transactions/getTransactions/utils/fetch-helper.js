
async function fetchAllRelevantItems(events, walletId, startsWithDate, endsWithDate) {
    events.push(getTransactionItem(walletId, startsWithDate, endsWithDate));
    events.push(getBudgetsItem(walletId, startsWithDate, endsWithDate));
    events.push(getCategoryData(walletId, startsWithDate, endsWithDate));
    events.push(getBankAccountData(walletId));
    events.push(getDateData(walletId, startsWithDate.substring(0, 4)));
    events.push(getRecurringTransactions(walletId));
    await Promise.all(events).then(function () {
        console.log("Successfully fetched all the relevant information");
    }, function (err) {
        throw new Error("Unable error occured while fetching the Budget " + err);
    });
}


async function fetchWalletItem(walletId, userId) {
    if (isEmpty(walletId) && isNotEmpty(userId)) {
        await getWalletsData(userId).then(function (result) {
            walletId = result.Wallet[0].walletId;
            console.log("retrieved the wallet for the item ", walletId);
        }, function (err) {
            throw new Error("Unable error occured while fetching the transaction " + err);
        });
    }
    return walletId;
}
