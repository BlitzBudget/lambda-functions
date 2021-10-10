module.exports.organize = (data) => {
  console.log('data retrieved - Wallet %j', data.Count);
  if (data.Items) {
    data.Items.forEach((walletObj) => {
      const wallet = walletObj;
      wallet.walletId = walletObj.sk;
      wallet.userId = walletObj.pk;
      delete wallet.sk;
      delete wallet.pk;
    });
  }
};
