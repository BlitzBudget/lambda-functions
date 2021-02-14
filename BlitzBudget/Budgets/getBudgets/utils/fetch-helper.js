var fetchHelper = function () {};
const helper = require('helper');
const bankAccount = require('../fetch/bank-account');
const budget = require('../fetch/budget');
const category = require('../fetch/category');
const date = require('../fetch/date');
const transaction = require('../fetch/transaction');
const wallet = require('../fetch/wallet');

async function fetchWalletsIfEmpty(walletId, userId, budgetData, docClient) {
  if (helper.isEmpty(walletId) && helper.isNotEmpty(userId)) {
    await wallet.getWalletsData(userId, budgetData, docClient).then(
      function (result) {
        walletId = result.Wallet[0].walletId;
        console.log('retrieved the wallet for the item ', walletId);
      },
      function (err) {
        throw new Error(
          'Unable error occured while fetching the transaction ' + err
        );
      }
    );
  }
  return walletId;
}

async function fetchAllInformationForBudget(
  events,
  walletId,
  startsWithDate,
  endsWithDate,
  fullMonth,
  budgetData,
  docClient
) {
  events.push(
    budget.getBudgetsItem(
      walletId,
      startsWithDate,
      endsWithDate,
      budgetData,
      docClient
    )
  );
  events.push(
    category.getCategoryData(
      walletId,
      startsWithDate,
      endsWithDate,
      budgetData,
      docClient
    )
  );
  events.push(
    date.getDateData(
      walletId,
      startsWithDate.substring(0, 4),
      budgetData,
      docClient
    )
  );
  events.push(bankAccount.getBankAccountData(walletId, budgetData, docClient));
  if (!fullMonth) {
    events.push(
      transaction.getTransactionsData(
        walletId,
        startsWithDate,
        endsWithDate,
        budgetData,
        docClient
      )
    );
  }

  await Promise.all(events).then(
    function () {
      console.log('Successfully retrieved all relevant information');
    },
    function (err) {
      throw new Error('Unable error occured while fetching the Budget ' + err);
    }
  );
}

fetchHelper.prototype.fetchAllInformationForBudget = fetchAllInformationForBudget;
fetchHelper.prototype.fetchWalletsIfEmpty = fetchWalletsIfEmpty;

// Export object
module.exports = new fetchHelper();
