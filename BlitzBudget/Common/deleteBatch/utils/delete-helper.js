function DeleteHelper() {}

const helper = require('./helper');
const deleteRequestParameter = require('../create-parameter/delete-request');
const deleteRequestHelper = require('./delete-request-helper');

function buildRequestToDelete(result, walletId, events, documentClient) {
  console.log(
    'Starting to process the batch delete request for the item for the wallet %j',
    result.length,
  );
  const requestArr = [];

  result.forEach((item) => {
    console.log('Building the delete params for the item %j', item);
    requestArr.push(deleteRequestParameter.createParameter(walletId, item));
  });

  // Split array into sizes of 25
  const deleteRequests = helper.chunkArrayInGroups(requestArr, 25);

  // Push Events  to be executed in bulk
  deleteRequestHelper.bulkDeleteRequest(deleteRequests, events, documentClient);
}

async function deleteAllItemsInBulk(result, walletId, events, documentClient) {
  buildRequestToDelete(result, walletId, events, documentClient);

  await Promise.all(events).then(
    () => {
      console.log('successfully deleted all the items');
    },
    (err) => {
      throw new Error(`Unable to delete all the items ${err}`);
    },
  );
}

DeleteHelper.prototype.deleteAllItemsInBulk = deleteAllItemsInBulk;

// Export object
module.exports = new DeleteHelper();
