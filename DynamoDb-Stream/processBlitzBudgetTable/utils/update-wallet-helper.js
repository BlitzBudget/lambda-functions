const updateWallet = require('../update/wallet');
const util = require('./util');

module.exports.updateWalletBalance = (record, events, documentClient) => {
  const pk = record.dynamodb.Keys.pk.S;
  let balance = 0;
  let walletId; let accountType; let assetBalance = 0;
  let debtBalance = 0;

  console.log('event is %j for updating the wallet balance', JSON.stringify(record.dynamodb));

  if (util.isEqual(record.eventName, 'INSERT')) {
    balance = parseFloat(record.dynamodb.NewImage.account_balance.N);
    walletId = record.dynamodb.NewImage.primary_wallet.S;
    accountType = record.dynamodb.NewImage.account_type.S;
  } else if (util.isEqual(record.eventName, 'REMOVE')) {
    balance = parseFloat(record.dynamodb.OldImage.account_balance.N) * -1;
    walletId = record.dynamodb.OldImage.primary_wallet.S;
    accountType = record.dynamodb.OldImage.account_type.S;
  } else if (util.isEqual(record.eventName, 'MODIFY')) {
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

  if (util.isEqual(accountType, 'ASSET')) {
    assetBalance = balance;
  } else if (util.isEqual(accountType, 'DEBT')) {
    debtBalance = balance;
  }

  events.push(
    updateWallet.updateWalletBalance(
      walletId,
      pk,
      balance,
      assetBalance,
      debtBalance,
      documentClient,
    ),
  );
};
