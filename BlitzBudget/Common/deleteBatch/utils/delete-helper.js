var deleteHelper = function () {};

const deleteItems = require('../delete/items');
const helper = require('helper');

async function deleteAllItemsInBulk(result, walletId, events, DB) {
  buildRequestToDelete(result, walletId, events, DB);

  await Promise.all(events).then(
    function () {
      console.log('successfully deleted all the items');
    },
    function (err) {
      throw new Error('Unable to delete all the items ' + err);
    }
  );
}

function buildRequestToDelete(result, walletId, events, DB) {
  console.log(
    'Starting to process the batch delete request for the item for the wallet %j',
    result.length
  );
  let requestArr = [];
  for (const item of result) {
    console.log('Building the delete params for the item %j', item);
    requestArr.push({
      DeleteRequest: {
        Key: {
          pk: walletId,
          sk: item,
        },
      },
    });
  }

  // Split array into sizes of 25
  let deleteRequests = helper.chunkArrayInGroups(requestArr, 25);

  // Push Events  to be executed in bulk
  for (const deleteRequest of deleteRequests) {
    let params = {};
    params.RequestItems = {};
    params.RequestItems.blitzbudget = deleteRequest;
    console.log(
      'The delete request is in batch  with length %j',
      params.RequestItems.blitzbudget.length
    );
    // Delete Items in batch
    events.push(deleteItems.deleteItems(params, DB));
  }
}

deleteHelper.prototype.deleteAllItemsInBulk = deleteAllItemsInBulk;

// Export object
module.exports = new deleteHelper();
