const constants = require('../constants/constant');

module.exports.createParameter = (pk, sk, balance, assetBalance, debtBalance) => ({
  TableName: constants.TABLE_NAME,
  Key: {
    pk,
    sk,
  },
  UpdateExpression: 'set Wallet_balance = Wallet_balance + :ab, total_asset_balance = total_asset_balance + :tab, total_debt_balance = total_debt_balance + :dab',
  ConditionExpression: 'attribute_exists(Wallet_balance)',
  ExpressionAttributeValues: {
    ':ab': balance,
    ':tab': assetBalance,
    ':dab': debtBalance,
  },
  ReturnValues: 'NONE',
});
