const FetchHelper = () => {};

const helper = require('./helper');
const bankAccount = require('../fetch/bank-account');
const category = require('../fetch/category');
const date = require('../fetch/date');
const transaction = require('../fetch/transaction');
const wallet = require('../fetch/wallet');

async function fetchAllItems(
  walletId,
  startsWithDate,
  endsWithDate,
  oneYearAgo,
  overviewData,
  documentClient,
  events,
) {
  events.push(
    category.getCategoryData(
      walletId,
      startsWithDate,
      endsWithDate,
      overviewData,
      documentClient,
    ),
  );
  // Get Transaction Items
  events.push(
    transaction.getTransactionItems(
      walletId,
      startsWithDate,
      endsWithDate,
      overviewData,
      documentClient,
    ),
  );
  // Get Bank account for preview
  events.push(
    bankAccount.getBankAccountData(walletId, overviewData, documentClient),
  );
  // Get Dates information to calculate the monthly Income / expense per month
  events.push(
    date.getDateData(
      walletId,
      oneYearAgo,
      endsWithDate,
      overviewData,
      documentClient,
    ),
  );

  await Promise.all(events).then(
    () => {
      console.log('Cumilative data retrieved ', overviewData);
    },
    (err) => {
      throw new Error(
        `Unable error occured while fetching the transaction ${err}`,
      );
    },
  );
}

async function fetchAllWallets(walletId, userId, overviewData, documentClient) {
  let walletPK = walletId;
  const events = [];
  async function fetchWalletsFromUser() {
    await wallet.getWalletsData(userId, overviewData, documentClient).then(
      (result) => {
        walletPK = result.Wallet[0].walletId;
        console.log('retrieved the wallet for the item ', walletId);
      },
      (err) => {
        throw new Error(
          `Unable error occured while fetching the transaction ${err}`,
        );
      },
    );
  }

  if (util.isEmpty(walletId) && util.isNotEmpty(userId)) {
    await fetchWalletsFromUser(overviewData, documentClient);
  } else if (util.isNotEmpty(walletId) && util.isNotEmpty(userId)) {
    events.push(
      wallet.getWalletData(userId, walletId, overviewData, documentClient),
    );
  }
  return { walletPK, events };
}

FetchHelper.prototype.fetchAllWallets = fetchAllWallets;
FetchHelper.prototype.fetchAllItems = fetchAllItems;

// Export object
module.exports = new FetchHelper();
