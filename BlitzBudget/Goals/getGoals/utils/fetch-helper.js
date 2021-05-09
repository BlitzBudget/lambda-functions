function FetchHelper() {}

const util = require('./util');
const wallet = require('../fetch/wallet');
const date = require('../fetch/date');
const goal = require('../fetch/goal');
const bankAccount = require('../fetch/bank-account');

const fetchOtherRelevantInformation = async (
  events,
  walletId,
  oneYearAgo,
  today,
  documentClient,
) => {
  const response = {};
  events.push(bankAccount.getBankAccountData(walletId, documentClient));
  events.push(goal.getGoalData(walletId, documentClient));
  // Get Dates information to calculate the monthly Income / expense per month
  events.push(
    date.getDateData(walletId, oneYearAgo, today, documentClient),
  );

  await Promise.all(events).then(
    (allResponses) => {
      response.BankAccount = allResponses[0].BankAccount;
      response.Goal = allResponses[1].Goal;
      response.Date = allResponses[2].Date;
      console.log('successfully retrieved all information');
    },
    (err) => {
      throw new Error(`Unable error occured while fetching the goal ${err}`);
    },
  );

  return response;
};

async function fetchWalletsFromUser(walletId,
  userId,
  documentClient) {
  let walletPK = walletId;

  await wallet.getWalletsData(userId, documentClient).then(
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

  return walletPK;
}

const fetchWalletInformation = async (
  walletId,
  userId,
  documentClient,
) => {
  let walletPK = walletId;
  let response = {};

  if (util.isEmpty(walletId) && util.isNotEmpty(userId)) {
    walletPK = await fetchWalletsFromUser(walletId, userId, documentClient);
  } else if (util.isNotEmpty(walletId) && util.isNotEmpty(userId)) {
    response = await wallet.getWalletData(userId, walletId, documentClient);
  }
  return { walletPK, response };
};

FetchHelper.prototype.fetchWalletInformation = fetchWalletInformation;
FetchHelper.prototype.fetchOtherRelevantInformation = fetchOtherRelevantInformation;
// Export object
module.exports = new FetchHelper();
