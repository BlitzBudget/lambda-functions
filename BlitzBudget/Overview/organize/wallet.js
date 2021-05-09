module.exports.organize = (data) => {
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
