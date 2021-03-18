const FetchHelper = () => {};

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const helper = require('./helper');
const constants = require('../constants/constant');
const transaction = require('../fetch/transaction');
const wallet = require('../fetch/wallet');
const date = require('../fetch/date');
const bankAccount = require('../fetch/bank-account');
const category = require('../fetch/category');
const budget = require('../fetch/budget');
const recurringTransaction = require('../fetch/recurring-transaction');

// Set the region
AWS.config.update({
  region: constants.EU_WEST_ONE,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: constants.EU_WEST_ONE,
});

const sns = new AWS.SNS();

async function fetchAllRelevantItems(
  events,
  walletId,
  startsWithDate,
  endsWithDate,
) {
  let allResponses;
  const snsEvents = [];
  events.push(
    transaction.getTransactionItem(
      walletId,
      startsWithDate,
      endsWithDate,
      documentClient,
    ),
  );
  events.push(
    budget.getBudgetsItem(walletId, startsWithDate, endsWithDate, documentClient),
  );
  events.push(
    category.getCategoryData(walletId, startsWithDate, endsWithDate, documentClient),
  );
  events.push(bankAccount.getBankAccountData(walletId, documentClient));
  events.push(
    date.getDateData(walletId, startsWithDate.substring(0, 4), documentClient),
  );
  events.push(
    recurringTransaction.getRecurringTransactions(
      walletId,
      documentClient,
      snsEvents,
      sns,
    ),
  );
  await Promise.all(events).then(
    (response) => {
      allResponses = response;
      console.log('Successfully fetched all the relevant information');
    },
    (err) => {
      throw new Error(`Unable error occured while fetching the Budget ${err}`);
    },
  );
  return { allResponses, snsEvents };
}

async function fetchWalletItem(walletId, userId) {
  let walletPK = walletId;
  async function handleWalletItem() {
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
    await handleWalletItem();
  }
  return walletPK;
}

FetchHelper.prototype.fetchWalletItem = fetchWalletItem;
FetchHelper.prototype.fetchAllRelevantItems = fetchAllRelevantItems;
// Export object
module.exports = new FetchHelper();
