const constants = require('../constants/constant');

module.exports.createParameter = (userId, walletId) => ({
  AttributesToGet: [
    'currency',
    'total_asset_balance',
    'total_debt_balance',
    'wallet_balance',
  ],
  TableName: constants.TABLE_NAME,
  Key: {
    pk: userId,
    sk: walletId,
  },
});
