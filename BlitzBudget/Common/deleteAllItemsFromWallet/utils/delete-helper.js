var deleteHelper = function () {};

const helper = require('helper');
const deleteItems = require('../delete/items.js');

async function bulkDeleteItems(result, walletId, DB) {
  let events = buildDeleteRequest(result, walletId, DB);

  await Promise.all(events).then(
    function () {
      console.log('successfully deleted all the items');
    },
    function (err) {
      throw new Error('Unable to delete all the items ' + err);
    }
  );
}

function buildDeleteRequest(result, walletId, DB) {
  console.log(
    'Starting to process the batch delete request for the item for the wallet %j',
    result.Count
  );
  let requestArr = [];
  let events = [];

  for (const item of result.Items) {
    console.log('Building the delete params for the item %j', item.sk);
    requestArr.push({
      DeleteRequest: {
        Key: {
          pk: walletId,
          sk: item.sk,
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

deleteHelper.prototype.bulkDeleteItems = bulkDeleteItems;

// Export object
module.exports = new deleteHelper();
