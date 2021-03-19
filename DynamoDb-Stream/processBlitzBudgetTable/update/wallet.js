const Wallet = () => {};

const walletParameter = require('../create-parameter/wallet');

async function updateWalletBalance(pk, sk, balance, assetBalance, debtBalance, documentClient) {
  const params = walletParameter.createParameter(pk, sk, balance, assetBalance, debtBalance);

  console.log('Updating the item...');

  const response = await documentClient.update(params).promise();
  return response;
}

Wallet.prototype.updateWalletBalance = updateWalletBalance;
// Export object
module.exports = new Wallet();
