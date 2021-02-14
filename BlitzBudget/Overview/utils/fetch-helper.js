var fetchHelper = function () {};

const bankAccount = require('../fetch/bank-account');
const category = require('../fetch/category');
const date = require('../fetch/date');
const transaction = require('../fetch/transaction');
const wallet = require('../fetch/wallet');
const helper = require('helper');

async function fetchAllItems(
  walletId,
  startsWithDate,
  endsWithDate,
  oneYearAgo,
  overviewData,
  docClient
) {
  let events = [];
  events.push(
    category.getCategoryData(
      walletId,
      startsWithDate,
      endsWithDate,
      overviewData,
      docClient
    )
  );
  // Get Transaction Items
  events.push(
    transaction.getTransactionItems(
      walletId,
      startsWithDate,
      endsWithDate,
      overviewData,
      docClient
    )
  );
  // Get Bank account for preview
  events.push(
    bankAccount.getBankAccountData(walletId, overviewData, docClient)
  );
  // Get Dates information to calculate the monthly Income / expense per month
  events.push(
    date.getDateData(
      walletId,
      oneYearAgo,
      endsWithDate,
      overviewData,
      docClient
    )
  );

  await Promise.all(events).then(
    function () {
      console.log('Cumilative data retrieved ', overviewData);
    },
    function (err) {
      throw new Error(
        'Unable error occured while fetching the transaction ' + err
      );
    }
  );
}

async function fetchAllWallets(walletId, userId, overviewData, docClient) {
  if (helper.isEmpty(walletId) && helper.isNotEmpty(userId)) {
    await fetchWalletsFromUser(overviewData, docClient);
  } else if (helper.isNotEmpty(walletId) && helper.isNotEmpty(userId)) {
    events.push(
      wallet.getWalletData(userId, walletId, overviewData, docClient)
    );
  }
  return walletId;

  async function fetchWalletsFromUser(overviewData, docClient) {
    await wallet.getWalletsData(userId, overviewData, docClient).then(
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
}

fetchHelper.prototype.fetchAllWallets = fetchAllWallets;
fetchHelper.prototype.fetchAllItems = fetchAllItems;

// Export object
module.exports = new fetchHelper();
