module.exports.convertAccountKeys = (data) => {
  data.Items.forEach((accountObj) => {
    const account = accountObj;
    account.accountId = accountObj.sk;
    account.walletId = accountObj.pk;
    delete account.sk;
    delete account.pk;
  });
};
