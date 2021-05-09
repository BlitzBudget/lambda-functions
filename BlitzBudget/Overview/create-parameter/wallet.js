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

module.exports.createParameterForUserID = (userId) => ({
  TableName: 'blitzbudget',
  KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
  ExpressionAttributeValues: {
    ':pk': userId,
    ':items': 'Wallet#',
  },
  ProjectionExpression:
    'currency, pk, sk, read_only, total_asset_balance, total_debt_balance, wallet_balance',
});
