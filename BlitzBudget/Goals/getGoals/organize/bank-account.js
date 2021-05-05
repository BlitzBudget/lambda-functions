module.exports.organize = (data) => {
  console.log('data retrieved - Bank Account %j', data.Count);
  if (data.Items) {
    data.Items.forEach((accountObj) => {
      const account = accountObj;
      account.accountId = accountObj.sk;
      account.walletId = accountObj.pk;
      delete account.sk;
      delete account.pk;
    });
  }
};
