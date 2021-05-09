function FetchHelper() {}

const util = require('./util');
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
  documentClient,
) {
  const response = {};
  const events = [];

  events.push(
    category.getCategoryData(
      walletId,
      startsWithDate,
      endsWithDate,
      documentClient,
    ),
  );
  // Get Transaction Items
  events.push(
    transaction.getTransactionsData(
      walletId,
      startsWithDate,
      endsWithDate,
      documentClient,
    ),
  );
  // Get Bank account for preview
  events.push(
    bankAccount.getBankAccountData(walletId, documentClient),
  );
  // Get Dates information to calculate the monthly Income / expense per month
  events.push(
    date.getDateData(
      walletId,
      oneYearAgo,
      endsWithDate,
      documentClient,
    ),
  );

  await Promise.all(events).then(
    (allResponses) => {
      response.Category = allResponses[0].Category;
      response.Transaction = allResponses[1].Transaction;
      response.BankAccount = allResponses[2].BankAccount;
      response.Date = allResponses[3].Date;
      console.log(`Cumilative data retrieved ${response}`);
    },
    (err) => {
      throw new Error(
        `Unable error occured while fetching the transaction ${err}`,
      );
    },
  );

  return response;
}

async function fetchWalletsFromUser(userId, walletId, documentClient) {
  let walletPK = walletId;
  await wallet.getWalletsData(userId, documentClient).then(
    (result) => {
      walletPK = result.Wallet[0].walletId;
      console.log('retrieved the wallet for the item ', walletPK);
    },
    (err) => {
      throw new Error(
        `Unable error occured while fetching the transaction ${err}`,
      );
    },
  );

  return walletPK;
}

async function fetchAllWallets(walletId, userId, documentClient) {
  let walletPK = walletId;
  let response = {};

  if (util.isEmpty(walletId) && util.isNotEmpty(userId)) {
    walletPK = await fetchWalletsFromUser(userId, walletId, documentClient);
  } else if (util.isNotEmpty(walletId) && util.isNotEmpty(userId)) {
    response = await wallet.getWalletData(userId, walletId, documentClient);
  }
  return { walletPK, response };
}

FetchHelper.prototype.fetchAllWallets = fetchAllWallets;
FetchHelper.prototype.fetchAllItems = fetchAllItems;

// Export object
module.exports = new FetchHelper();
