var fetchHelper = function () { };

const helper = require('helper');
const transaction = require('../fetch/transaction');
const wallet = require('../fetch/wallet');
const date = require('../fetch/date');
const bankAccount = require('../fetch/bank-account');
const category = require('../fetch/category');
const budget = require('../fetch/budget');
const recurringTransaction = require('../fetch/recurring-transaction');

async function fetchAllRelevantItems(events, walletId, startsWithDate, endsWithDate, docClient, snsEvents) {
    events.push(transaction.getTransactionItem(walletId, startsWithDate, endsWithDate, docClient));
    events.push(budget.getBudgetsItem(walletId, startsWithDate, endsWithDate, docClient));
    events.push(category.getCategoryData(walletId, startsWithDate, endsWithDate, docClient));
    events.push(bankAccount.getBankAccountData(walletId, docClient));
    events.push(date.getDateData(walletId, startsWithDate.substring(0, 4), docClient));
    events.push(recurringTransaction.getRecurringTransactions(walletId, docClient, snsEvents, sns));
    await Promise.all(events).then(function () {
        console.log("Successfully fetched all the relevant information");
    }, function (err) {
        throw new Error("Unable error occured while fetching the Budget " + err);
    });
}

async function fetchWalletItem(walletId, userId, docClient) {
    if (helper.isEmpty(walletId) && helper.isNotEmpty(userId)) {
        await handleWalletItem();
    }
    return walletId;

    async function handleWalletItem() {
        await wallet.getWalletsData(userId, docClient).then(function (result) {
            walletId = result.Wallet[0].walletId;
            console.log("retrieved the wallet for the item ", walletId);
        }, function (err) {
            throw new Error("Unable error occured while fetching the transaction " + err);
        });
    }
}

fetchHelper.prototype.fetchWalletItem = fetchWalletItem;
fetchHelper.prototype.fetchAllRelevantItems = fetchAllRelevantItems;
// Export object
module.exports = new fetchHelper(); 