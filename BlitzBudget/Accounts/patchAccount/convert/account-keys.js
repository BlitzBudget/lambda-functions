module.exports.convertAccountKeys = (account) => {
  const updateItem = {};
  updateItem['body-json'] = {};
  updateItem['body-json'].selectedAccount = false;
  updateItem['body-json'].walletId = account.pk;
  updateItem['body-json'].accountId = account.sk;
  return updateItem;
};
