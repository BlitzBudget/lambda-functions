const UpdateHelper = () => { };

const AWS = require('aws-sdk');
const helper = require('./helper');
const updateAccount = require('../update/account');
const updateCategory = require('../update/category');
const updateDate = require('../update/date');
const updateWallet = require('../update/wallet');
const addBankAccount = require('../add/bank-account');

// Load the AWS SDK for Node.js
// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient();

function updateAccountBalance(record, events) {
  const pk = record.dynamodb.Keys.pk.S;
  let balance = 0;
  let account;
  console.log('event is %j', record.eventName);
  if (helper.isEqual(record.eventName, 'INSERT')) {
    balance = parseFloat(record.dynamodb.NewImage.amount.N);
    account = record.dynamodb.NewImage.account.S;
  } else if (helper.isEqual(record.eventName, 'REMOVE')) {
    balance = parseFloat(record.dynamodb.OldImage.amount.N) * -1;
    account = record.dynamodb.OldImage.account.S;
  } else if (helper.isEqual(record.eventName, 'MODIFY')) {
    balance = parseFloat(record.dynamodb.NewImage.amount.N)
    + (parseFloat(record.dynamodb.OldImage.amount.N) * -1);
    account = record.dynamodb.NewImage.account.S;
    const oldAccount = record.dynamodb.OldImage.account.S;
    if (helper.isNotEqual(account, oldAccount)) {
      const oldBalance = (parseFloat(record.dynamodb.OldImage.amount.N) * -1);
      const newBalance = parseFloat(record.dynamodb.NewImage.amount.N);
      events.push(updateAccount.updateAccountBalanceItem(pk, account, newBalance, docClient));
      events.push(updateAccount.updateAccountBalanceItem(pk, oldAccount, oldBalance, docClient));
      return;
    }
  }

  console.log('adding the difference %j', balance, 'to the account %j', account);

  // if balance is 0 then do nothing
  if (balance === 0) {
    return;
  }

  events.push(updateAccount.updateAccountBalanceItem(pk, account, balance, docClient));
}

function updateWalletBalance(record, events) {
  const pk = record.dynamodb.Keys.pk.S;
  let balance = 0;
  let walletId; let accountType; let assetBalance = 0;
  let debtBalance = 0;

  console.log('event is %j for updating the wallet balance', JSON.stringify(record.dynamodb));

  if (helper.isEqual(record.eventName, 'INSERT')) {
    balance = parseFloat(record.dynamodb.NewImage.account_balance.N);
    walletId = record.dynamodb.NewImage.primary_wallet.S;
    accountType = record.dynamodb.NewImage.account_type.S;
  } else if (helper.isEqual(record.eventName, 'REMOVE')) {
    balance = parseFloat(record.dynamodb.OldImage.account_balance.N) * -1;
    walletId = record.dynamodb.OldImage.primary_wallet.S;
    accountType = record.dynamodb.OldImage.account_type.S;
  } else if (helper.isEqual(record.eventName, 'MODIFY')) {
    balance = parseFloat(record.dynamodb.NewImage.account_balance.N)
    + (parseFloat(record.dynamodb.OldImage.account_balance.N) * -1);
    walletId = record.dynamodb.NewImage.primary_wallet.S;
    accountType = record.dynamodb.NewImage.account_type.S;
  }

  console.log('Adding the difference %j to the wallet', balance);

  // if balance is 0 then do nothing
  if (balance === 0) {
    return;
  }

  if (helper.isEqual(accountType, 'ASSET')) {
    assetBalance = balance;
  } else if (helper.isEqual(accountType, 'DEBT')) {
    debtBalance = balance;
  }

  events.push(
    updateWallet.updateWalletBalance(walletId, pk, balance, assetBalance, debtBalance, docClient),
  );
}

function updateCategoryTotal(record, events) {
  const pk = record.dynamodb.Keys.pk.S;
  let balance = 0;
  let category;
  console.log('event is %j', record.eventName);
  if (helper.isEqual(record.eventName, 'INSERT')) {
    balance = parseFloat(record.dynamodb.NewImage.amount.N);
    category = record.dynamodb.NewImage.category.S;
  } else if (helper.isEqual(record.eventName, 'REMOVE')) {
    balance = parseFloat(record.dynamodb.OldImage.amount.N) * -1;
    category = record.dynamodb.OldImage.category.S;
  } else if (helper.isEqual(record.eventName, 'MODIFY')) {
    // If the balance has changed
    balance = parseFloat(record.dynamodb.NewImage.amount.N)
    + (parseFloat(record.dynamodb.OldImage.amount.N) * -1);
    category = record.dynamodb.NewImage.category.S;
    // If the category has changed
    if (helper.isNotEqual(category, record.dynamodb.OldImage.category.S)) {
      // The old balance is deducted from the old category
      balance = (parseFloat(record.dynamodb.OldImage.amount.N) * -1);
      category = record.dynamodb.OldImage.category.S;
      // Event is pushed to the array
      console.log('adding the difference %j', balance, 'to the category %j', category);
      events.push(updateCategory.updateCategoryItem(pk, category, balance, docClient));
      // The new balance is added to the new category
      balance = parseFloat(record.dynamodb.NewImage.amount.N);
      category = record.dynamodb.NewImage.category.S;
    }
  }

  console.log('adding the difference %j', balance, 'to the category %j', category);

  // if balance is 0 then do nothing
  if (balance === 0) {
    return;
  }

  events.push(updateCategory.updateCategoryItem(pk, category, balance, docClient));
}

function updateDateTotal(record, events) {
  const pk = record.dynamodb.Keys.pk.S;
  let balance = 0;
  let date; let categoryType; let income = 0;
  let expense = 0;
  console.log('event is %j', record.eventName);
  if (helper.isEqual(record.eventName, 'INSERT')) {
    return;
  } if (helper.isEqual(record.eventName, 'REMOVE')) {
    balance = parseFloat(record.dynamodb.OldImage.category_total.N) * -1;
    categoryType = record.dynamodb.OldImage.category_type.S;
    date = record.dynamodb.OldImage.date_meant_for.S;
  } else if (helper.isEqual(record.eventName, 'MODIFY')) {
    balance = parseFloat(record.dynamodb.NewImage.category_total.N)
    + (parseFloat(record.dynamodb.OldImage.category_total.N) * -1);
    categoryType = record.dynamodb.NewImage.category_type.S;
    date = record.dynamodb.NewImage.date_meant_for.S;
  }

  console.log('adding the difference %j', balance, 'to the date %j', date);

  // if balance is 0 then do nothing
  if (balance === 0) {
    return;
  }

  if (helper.isEqual(categoryType, 'Expense')) {
    expense = balance;
  } else if (helper.isEqual(categoryType, 'Income')) {
    income = balance;
  }

  events.push(updateDate.updateDateItem(pk, date, balance, income, expense, docClient));
}

async function updateRelevantItems(event) {
  const events = [];

  console.log('Received event:', JSON.stringify(event, null, 2));
  Object.keys(event.Records).forEach((record) => {
    try {
      const sortKey = record.dynamodb.Keys.sk.S;
      console.log('Started processing the event with the sort key %j', sortKey);
      console.log('Started processing the event with id %j', record.eventID);
      console.log('The event name is %j', record.eventName);

      // If the entries are not transactions / bank accounts then do not process
      if (helper.includesStr(sortKey, 'Transaction#')) {
        console.log('Updating the category total and account balance');
        updateCategoryTotal(record, events);
        updateAccountBalance(record, events);
      } else if (helper.includesStr(sortKey, 'BankAccount#')) {
        console.log('Updating the wallet account balance');
        updateWalletBalance(record, events);
      } else if (helper.includesStr(sortKey, 'Wallet#') && helper.isEqual(record.eventName, 'INSERT')) {
        console.log('Adding a new bank account for the newly created wallet');
        events.push(addBankAccount.addNewBankAccount(record, docClient));
      } else if (helper.includesStr(sortKey, 'Category#')) {
        console.log('Updating the date wrapper with the total');
        updateDateTotal(record, events);
      }
    } catch (ex) {
      console.log('Could not complete operation', ex);
      console.log('The record that could not be process is %j', JSON.stringify(record));
    }
  });

  async function fulfillPromise() {
    try {
      await Promise.all(events);
    } catch (ex) {
      console.log('Could not complete operation ', ex);
    }
  }

  await fulfillPromise();
}

UpdateHelper.prototype.updateRelevantItems = updateRelevantItems;
// Export object
module.exports = new UpdateHelper();
