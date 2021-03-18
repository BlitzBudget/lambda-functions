const DeleteHelper = () => {};

const helper = require('./helper');
const deleteItems = require('../delete/items.js');
const deleteParameter = require('../create-parameter/delete.js');

function buildDeleteRequest(result, walletId, DB) {
  console.log(
    'Starting to process the batch delete request for the item for the wallet %j',
    result.Count,
  );
  const requestArr = [];
  const events = [];

  result.Items.forEach((item) => {
    console.log('Building the delete params for the item %j', item.sk);
    requestArr.push({
      DeleteRequest: {
        Key: {
          pk: walletId,
          sk: item.sk,
        },
      },
    });
  });

  // Split array into sizes of 25
  const deleteRequests = helper.chunkArrayInGroups(requestArr, 25);

  // Push Events  to be executed in bulk
  deleteRequests.forEach((deleteRequest) => {
    const params = deleteParameter.createParameter(deleteRequest);
    console.log(
      'The delete request is in batch  with length %j',
      params.RequestItems.blitzbudget.length,
    );
    // Delete Items in batch
    events.push(deleteItems.deleteItems(params, DB));
  });
}

async function bulkDeleteItems(result, walletId, DB) {
  const events = buildDeleteRequest(result, walletId, DB);

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
