var fetchHelper = function () { };

const helper = require('helper');
const wallet = require('../fetch/wallet');
const date = require('../fetch/date');
const goal = require('../fetch/goal');
const bankAccount = require('../fetch/bank-account');

let fetchOtherRelevantInformation = async function(events, walletId, oneYearAgo, today, docClient, goalData) {
    events.push(bankAccount.getBankAccountData(walletId, docClient, goalData));
    events.push(goal.getGoalItem(walletId, docClient, goalData));
    // Get Dates information to calculate the monthly Income / expense per month
    events.push(date.getDateData(walletId, oneYearAgo, today, docClient, goalData));

    await Promise.all(events).then(function () {
        console.log("successfully retrieved all information");
    }, function (err) {
        throw new Error("Unable error occured while fetching the goal " + err);
    });
}

let fetchWalletInformation = async function(walletId, userId, events, docClient, goalData) {
    if (helper.isEmpty(walletId) && helper.isNotEmpty(userId)) {
        walletId = await fetchWalletsFromUser(userId, docClient, goalData, walletId);
    } else if (helper.isNotEmpty(walletId) && helper.isNotEmpty(userId)) {
        events.push(wallet.getWalletData(userId, walletId, docClient, goalData));
    }
    return walletId;
}

async function fetchWalletsFromUser(userId, docClient, goalData, walletId) {
    await wallet.getWalletsData(userId, docClient, goalData).then(function (result) {
        walletId = result.Wallet[0].walletId;
        console.log("retrieved the wallet for the item ", walletId);
    }, function (err) {
        throw new Error("Unable error occured while fetching the transaction " + err);
    });
    return walletId;
}

fetchHelper.prototype.fetchWalletInformation = fetchWalletInformation;
fetchHelper.prototype.fetchOtherRelevantInformation = fetchOtherRelevantInformation;
// Export object
module.exports = new fetchHelper();
