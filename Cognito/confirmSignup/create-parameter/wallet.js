const constants = require('../constants/constant');

module.exports.createParameter = (userId, randomValue, currentCurrency) => ({
  TableName: constants.TABLE_NAME,
  Item: {
    pk: userId,
    sk: randomValue,
    currency: currentCurrency,
    wallet_balance: 0,
    total_asset_balance: 0,
    total_debt_balance: 0,
    creation_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
  },
});
