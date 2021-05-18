module.exports.createParameter = (userId, randomValue, chosenCurrency, walletName) => ({
  TableName: process.env.TABLE_NAME,
  Item: {
    pk: userId,
    sk: randomValue,
    currency: chosenCurrency,
    wallet_name: walletName,
    wallet_balance: 0,
    total_asset_balance: 0,
    total_debt_balance: 0,
    creation_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
  },
});
