const FetchHelper = () => {};

const helper = require('./helper');
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
  let response;
  events.push(bankAccount.getBankAccountData(walletId, documentClient));
  events.push(goal.getGoalItem(walletId, documentClient));
  // Get Dates information to calculate the monthly Income / expense per month
  events.push(
    date.getDateData(walletId, oneYearAgo, today, documentClient),
  );

  await Promise.all(events).then(
    (allResonses) => {
      response = allResonses;
      console.log('successfully retrieved all information');
    },
    (err) => {
      throw new Error(`Unable error occured while fetching the goal ${err}`);
    },
  );

  return response;
};

const fetchWalletInformation = async (
  walletId,
  userId,
  events,
  documentClient,
) => {
  let walletPK = walletId;
  async function fetchWalletsFromUser() {
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
  }

  if (helper.isEmpty(walletId) && helper.isNotEmpty(userId)) {
    walletPK = await fetchWalletsFromUser();
  } else if (helper.isNotEmpty(walletId) && helper.isNotEmpty(userId)) {
    events.push(wallet.getWalletData(userId, walletId, documentClient));
  }
  return walletPK;
};

FetchHelper.prototype.fetchWalletInformation = fetchWalletInformation;
FetchHelper.prototype.fetchOtherRelevantInformation = fetchOtherRelevantInformation;
// Export object
module.exports = new FetchHelper();
