const Wallet = () => {};

const transactionParameter = require('../create-parameter/transaction');

Wallet.prototype.getWalletsData = async (userId, documentClient) => {
  function organizeWalletData(data) {
    if (data.Items) {
      Object.keys(data.Items).forEach((walletObj) => {
        const wallet = walletObj;
        wallet.walletId = walletObj.sk;
        wallet.userId = walletObj.pk;
        delete wallet.sk;
        delete wallet.pk;
      });
    }
  }

  const params = transactionParameter.createParameters(userId);

  // Call DynamoDB to read the item from the table
  const response = documentClient.query(params).promise();

  organizeWalletData(response);
  return {
    Wallet: response.Items,
  };
};

// Export object
module.exports = new Wallet();
