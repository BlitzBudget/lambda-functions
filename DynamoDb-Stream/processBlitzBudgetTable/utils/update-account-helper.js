const updateAccount = require('../update/account');
const helper = require('./helper');

module.exports.updateAccountBalance = (record, events, documentClient) => {
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
      events.push(updateAccount.updateAccountBalanceItem(pk, account, newBalance, documentClient));
      events.push(updateAccount.updateAccountBalanceItem(
        pk,
        oldAccount,
        oldBalance,
        documentClient,
      ));
      return;
    }
  }

  console.log('adding the difference %j', balance, 'to the account %j', account);

  // if balance is 0 then do nothing
  if (balance === 0) {
    return;
  }

  events.push(updateAccount.updateAccountBalanceItem(pk, account, balance, documentClient));
};
