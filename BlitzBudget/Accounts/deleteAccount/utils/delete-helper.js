const DeleteHelper = () => {};

const helper = require('./helper');

async function buildRequestAndDeleteAccount(
  result,
  walletId,
  accountToDelete,
  DB,
) {
  helper.logResultIfEmpty(result, walletId);

  const deleteRequests = helper.buildDeleteRequest(
    result,
    walletId,
    accountToDelete,
  );

  // Push Events  to be executed in bulk
  const events = await helper.deleteAccountsAndItsData(deleteRequests, DB);
  return events;
}

DeleteHelper.prototype.buildRequestAndDeleteAccount = buildRequestAndDeleteAccount;
// Export object
module.exports = new DeleteHelper();
