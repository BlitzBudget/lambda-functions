const FetchWallet = () => {};

const walletParameter = require('../create-parameter/wallet');

FetchWallet.prototype.getWallet = (userId, docClient) => {
  const params = walletParameter.createParameters(userId);

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('data retrieved ', data.Count);
        Object.keys(data.Items).forEach((walletObj) => {
          const wallet = walletObj;
          wallet.walletId = walletObj.sk;
          wallet.userId = walletObj.pk;
          delete wallet.sk;
          delete wallet.pk;
        });
        resolve(data.Items);
      }
    });
  });
};

// Export object
module.exports = new FetchWallet();
