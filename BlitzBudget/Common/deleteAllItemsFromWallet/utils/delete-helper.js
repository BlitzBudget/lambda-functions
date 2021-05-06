function DeleteHelper() {}

const util = require('./util');
const deleteItems = require('../delete/items.js');
const deleteParameter = require('../create-parameter/delete');
const deleteRequestParameter = require('../create-parameter/delete-request');

function buildDeleteRequest(result, walletId, documentClient) {
  console.log(
    'Starting to process the batch delete request for the item for the wallet %j',
    result.Count,
  );
  const requestArr = [];
  const events = [];

  result.Items.forEach((item) => {
    console.log('Building the delete params for the item %j', item.sk);
    requestArr.push(deleteRequestParameter.createParameter(walletId, item.sk));
  });

  // Split array into sizes of 25
  const deleteRequests = util.chunkArrayInGroups(requestArr, 25);

  // Push Events  to be executed in bulk
  deleteRequests.forEach((deleteRequest) => {
    const params = deleteParameter.createParameter(deleteRequest);
    console.log(
      'The delete request is in batch  with length %j',
      params.RequestItems.blitzbudget.length,
    );
    // Delete Items in batch
    events.push(deleteItems.deleteItems(params, documentClient));
  });

  return events;
}

async function bulkDeleteItems(result, walletId, documentClient) {
  const events = buildDeleteRequest(result, walletId, documentClient);

  await Promise.all(events).then(
    () => {
      console.log('successfully deleted all the items');
    },
    (err) => {
      throw new Error(`Unable to delete all the items ${err}`);
    },
  );
}

DeleteHelper.prototype.bulkDeleteItems = bulkDeleteItems;

// Export object
module.exports = new DeleteHelper();
