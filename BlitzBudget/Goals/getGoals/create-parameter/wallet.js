module.exports.createParameter = (userId, walletId) => ({
  AttributesToGet: [
    'currency',
    'total_asset_balance',
    'total_debt_balance',
    'wallet_balance',
  ],
  TableName: process.env.TABLE_NAME,
  Key: {
    pk: userId,
    sk: walletId,
  },
});

module.exports.createParameterForUserID = (userID) => ({
  TableName: process.env.TABLE_NAME,
  KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
  ExpressionAttributeValues: {
    ':pk': userID,
    ':items': 'Wallet#',
  },
  ProjectionExpression:
      'currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance',
});
