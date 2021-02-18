const DeleteHelper = () => {};

const helper = require('./helper');
const deleteItems = require('../delete/items');

function buildRequestToDelete(result, walletId, events, DB) {
  console.log(
    'Starting to process the batch delete request for the item for the wallet %j',
    result.length,
  );
  const requestArr = [];

  Object.keys(result).forEach((item) => {
    console.log('Building the delete params for the item %j', item);
    requestArr.push({
      DeleteRequest: {
        Key: {
          pk: walletId,
          sk: item,
        },
      },
    });
  });

  // Split array into sizes of 25
  const deleteRequests = helper.chunkArrayInGroups(requestArr, 25);

  // Push Events  to be executed in bulk
  Object.keys(deleteRequests).forEach((deleteRequest) => {
    const params = {};
    params.RequestItems = {};
    params.RequestItems.blitzbudget = deleteRequest;
    console.log(
      'The delete request is in batch  with length %j',
      params.RequestItems.blitzbudget.length,
    );
    // Delete Items in batch
    events.push(deleteItems.deleteItems(params, DB));
  });
}

async function deleteAllItemsInBulk(result, walletId, events, DB) {
  buildRequestToDelete(result, walletId, events, DB);

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
