module.exports.organize = (response) => {
  if (response.Items) {
    response.Items.forEach((walletObj) => {
      const walletItem = walletObj;
      walletItem.walletId = walletObj.sk;
      walletItem.userId = walletObj.pk;
      delete walletItem.sk;
      delete walletItem.pk;
    });
  }
};
