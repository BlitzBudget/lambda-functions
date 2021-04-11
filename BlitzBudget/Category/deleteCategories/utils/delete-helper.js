function DeleteHelper() {}

const util = require('./util');
const deleteItems = require('../delete/items');
const deleteRequestParameter = require('../create-parameter/delete-request');

function addChunksToDeleteArray(deleteRequests, documentClient) {
  const events = [];

  deleteRequests.forEach((deleteRequest) => {
    const params = {};
    params.RequestItems = {};
    params.RequestItems.blitzbudget = deleteRequest;
    console.log(
      'The delete request is in batch  with length %j',
      params.RequestItems.blitzbudget.length,
    );
    // Delete Items in batch
    events.push(deleteItems.deleteItems(params, documentClient));
  });

  return events;
}

function bulkBuildDeleteItemsRequest(response, walletId, categoryId) {
  console.log(
    'Starting to process the batch delete request for the transactions %j',
    response[0].Count,
    ' and for the budgets ',
    response[1].Count,
  );
  const requestArray = [];

  // Remove Category
  requestArray.push(deleteRequestParameter.createParameter(walletId, categoryId));

  // Result contains both Transaction and Budget items
  response.forEach((items) => {
    // Iterate through Transaction Item first and then Budget Item
    items.Items.forEach((item) => {
      // If transactions and budgets contain the category.
      if (util.isEqual(item.category, categoryId)) {
        console.log('Building the delete params for the item %j', item.sk);
        requestArray.push(deleteRequestParameter.createParameter(walletId, item.sk));
      }
    });
  });

  return requestArray;
}

async function bulkDeleteItems(response, walletId, categoryId, documentClient) {
  const requestArray = bulkBuildDeleteItemsRequest(response, walletId, categoryId);
  // Split array into sizes of 25
  const deleteRequests = util.chunkArrayInGroups(requestArray, 25);
  // Push Events to be executed in bulk
  const events = addChunksToDeleteArray(deleteRequests, documentClient);

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
