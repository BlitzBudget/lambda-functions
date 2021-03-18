const FetchWallet = () => {};

const walletParameter = require('../create-parameter/wallet');

async function getWalletsData(userId, documentClient) {
  function organizeTransactionData(data) {
    console.log('data retrieved - Wallet %j', data.Count);
    Object.keys(data.Items).forEach((walletObj) => {
      const wallet = walletObj;
      wallet.walletId = walletObj.sk;
      wallet.userId = walletObj.pk;
      delete wallet.sk;
      delete wallet.pk;
    });
  }

  const params = walletParameter.createParameters(userId);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  organizeTransactionData(response);
  return {
    Wallet: response.Items,
  };
}

FetchWallet.prototype.getWalletsData = getWalletsData;
// Export object
module.exports = new FetchWallet();
