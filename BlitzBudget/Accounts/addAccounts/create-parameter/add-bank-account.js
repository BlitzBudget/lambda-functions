module.exports.createParameter = (event, randomValue) => ({
  TableName: process.env.TABLE_NAME,
  Item: {
    pk: event['body-json'].walletId,
    sk: randomValue,
    account_type: event['body-json'].accountType,
    bank_account_name: event['body-json'].bankAccountName,
    linked: event['body-json'].linked,
    account_balance: event['body-json'].accountBalance,
    account_sub_type: event['body-json'].accountSubType,
    selected_account: event['body-json'].selectedAccount,
    primary_wallet: event['body-json'].primaryWallet,
    creation_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
  },
});
