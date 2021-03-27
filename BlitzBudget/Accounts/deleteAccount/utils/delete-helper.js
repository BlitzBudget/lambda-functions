function DeleteHelper() {}

const deleteItems = require('../delete/delete-items');
const deleteRequestHelper = require('./delete-request-helper');
const deleteItemParameter = require('../create-parameter/delete-item');

async function deleteAccountsAndItsData(deleteRequests, DB) {
  const events = [];
  deleteRequests.forEach((deleteRequest) => {
    const parameter = deleteItemParameter.createParameter(deleteRequest);
    console.log(
      'The delete request is in batch  with length %j',
      parameter.RequestItems.blitzbudget.length,
    );
    // Delete Items in batch
    events.push(deleteItems.deleteItems(parameter, DB));
  });

  await Promise.all(events).then(
    () => {
      console.log('successfully deleted all the items');
    },
    (err) => {
      throw new Error(`Unable to delete all the items ${err}`);
    },
  );
}

async function buildRequestAndDeleteAccount(
  result,
  walletId,
  accountId,
  documentClient,
) {
  if (result[0].Count === 0 && result[1].Count === 0) {
    console.log('There are no items to delete for the wallet %j', walletId);
    return;
  }

  const deleteRequests = deleteRequestHelper.buildDeleteRequest(
    result,
    walletId,
    accountId,
  );

  // Push Events  to be executed in bulk
  await deleteAccountsAndItsData(deleteRequests, documentClient);
}

DeleteHelper.prototype.buildRequestAndDeleteAccount = buildRequestAndDeleteAccount;
// Export object
module.exports = new DeleteHelper();
