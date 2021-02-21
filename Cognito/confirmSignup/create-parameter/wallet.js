module.exports.createParameter = (userId, randomValue, currency) => ({
  TableName: 'blitzbudget',
  Item: {
    pk: userId,
    sk: randomValue,
    currency,
    wallet_balance: 0,
    total_asset_balance: 0,
    total_debt_balance: 0,
    creation_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
  },
});
