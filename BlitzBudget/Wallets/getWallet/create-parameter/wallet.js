module.exports.createParameter = (userId) => ({
  TableName: process.env.TABLE_NAME,
  KeyConditionExpression: 'pk = :userId and begins_with(sk, :items)',
  ExpressionAttributeValues: {
    ':userId': userId,
    ':items': 'Wallet#',
  },
  ProjectionExpression: 'currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance, wallet_name',
});
