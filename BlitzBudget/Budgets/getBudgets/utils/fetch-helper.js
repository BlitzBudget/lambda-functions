function FetchHelper() {}
const util = require('./util');
const bankAccount = require('../fetch/bank-account');
const budget = require('../fetch/budget');
const category = require('../fetch/category');
const date = require('../fetch/date');
const transaction = require('../fetch/transaction');
const wallet = require('../fetch/wallet');

async function fetchWalletsIfEmpty(walletId, userId, documentClient) {
  let response;
  let walletPK = walletId;
  if (util.isEmpty(walletId) && util.isNotEmpty(userId)) {
    await wallet.getWalletsData(userId, documentClient).then(
      (result) => {
        response = result.Wallet;
        walletPK = result.Wallet[0].walletId;
        console.log('retrieved the wallet for the item ', walletPK);
      },
      (err) => {
        throw new Error(
          `Unable error occured while fetching the transaction ${err}`,
        );
      },
    );
  }
  return { walletPK, response };
}

async function fetchAllInformationForBudget(
  walletId,
  startsWithDate,
  endsWithDate,
  fullMonth,
  documentClient,
) {
  const events = [];
  const allResponse = {};

  events.push(
    budget.getBudgetData(
      walletId,
      startsWithDate,
      endsWithDate,
      documentClient,
    ),
  );
  events.push(
    category.getCategoryData(
      walletId,
      startsWithDate,
      endsWithDate,
      documentClient,
    ),
  );
  events.push(
    date.getDateData(
      walletId,
      startsWithDate.substring(0, 4),
      documentClient,
    ),
  );
  events.push(bankAccount.getBankAccountData(walletId, documentClient));

  if (!fullMonth) {
    events.push(
      transaction.getTransactionsData(
        walletId,
        startsWithDate,
        endsWithDate,
        documentClient,
      ),
    );
  }

  await Promise.all(events).then(
    (response) => {
      allResponse.Budget = response[0].Budget;
      allResponse.Category = response[1].Category;
      allResponse.Date = response[2].Date;
      allResponse.BankAccount = response[3].BankAccount;
      allResponse.Transaction = response[4] != null ? response[4].Transaction : {};
      console.log('Successfully retrieved all relevant information');
    },
    (err) => {
      throw new Error(`Unable error occured while fetching the Budget ${err}`);
    },
  );

  return allResponse;
}

FetchHelper.prototype.fetchAllInformationForBudget = fetchAllInformationForBudget;
FetchHelper.prototype.fetchWalletsIfEmpty = fetchWalletsIfEmpty;

// Export object
module.exports = new FetchHelper();
