function FetchHelper() {}

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const util = require('./util');
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
  region: constants.AWS_LAMBDA_REGION,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

const sns = new AWS.SNS();

function organizeResponse(response) {
  const allResponses = {};
  response.forEach((aResponse) => {
    if (util.isNotEmpty(aResponse.Transaction)) {
      allResponses.Transaction = aResponse.Transaction;
    } else if (util.isNotEmpty(aResponse.Budget)) {
      allResponses.Budget = aResponse.Budget;
    } else if (util.isNotEmpty(aResponse.Category)) {
      allResponses.Category = aResponse.Category;
    } else if (util.isNotEmpty(aResponse.BankAccount)) {
      allResponses.BankAccount = aResponse.BankAccount;
    } else if (util.isNotEmpty(aResponse.Date)) {
      allResponses.Date = aResponse.Date;
    } else if (util.isNotEmpty(aResponse.RecurringTransactions)) {
      allResponses.RecurringTransactions = aResponse.RecurringTransactions;
    }
  });

  return allResponses;
}

async function fetchAllRelevantItems(
  events,
  walletId,
  startsWithDate,
  endsWithDate,
) {
  let allResponses;
  const snsEvents = [];
  events.push(
    transaction.getTransactionData(
      walletId,
      startsWithDate,
      endsWithDate,
      documentClient,
    ),
  );
  events.push(
    budget.getBudgetsData(walletId, startsWithDate, endsWithDate, documentClient),
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
      allResponses = organizeResponse(response, allResponses);
      console.log('Successfully fetched all the relevant information');
    },
    (err) => {
      throw new Error(`Unable error occured while fetching the Budget ${err}`);
    },
  );
  return { allResponses, snsEvents };
}

async function handleWalletItem(userId, walletId) {
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

async function fetchWalletItem(walletId, userId) {
  let walletPK = walletId;

  if (util.isEmpty(walletId) && util.isNotEmpty(userId)) {
    walletPK = await handleWalletItem();
  }
  return walletPK;
}

FetchHelper.prototype.fetchWalletItem = fetchWalletItem;
FetchHelper.prototype.fetchAllRelevantItems = fetchAllRelevantItems;
// Export object
module.exports = new FetchHelper();
