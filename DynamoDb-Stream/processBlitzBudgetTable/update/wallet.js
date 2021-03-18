const Wallet = () => {};

const constants = require('../constants/constant');

async function updateWalletBalance(pk, sk, balance, assetBalance, debtBalance, documentClient) {
  const params = {
    TableName: constants.TABLE_NAME,
    Key: {
      pk,
      sk,
    },
    UpdateExpression:
      'set Wallet_balance = Wallet_balance + :ab, total_asset_balance = total_asset_balance + :tab, total_debt_balance = total_debt_balance + :dab',
    ConditionExpression: 'attribute_exists(Wallet_balance)',
    ExpressionAttributeValues: {
      ':ab': balance,
      ':tab': assetBalance,
      ':dab': debtBalance,
    },
    ReturnValues: 'NONE',
  };

  console.log('Updating the item...');

  const response = await documentClient.update(params).promise();
  return response;
}

Wallet.prototype.updateWalletBalance = updateWalletBalance;
// Export object
module.exports = new Wallet();
