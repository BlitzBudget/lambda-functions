const DeleteHelper = () => {};

const helper = require('./helper');
const deleteItems = require('../delete/items');

async function bulkDeleteItems(eventsArray, result, walletId, event, DB) {
  let events = eventsArray;
  let deleteRequests;
  function pushToBuildDelete() {
    events = [];
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
    return events;
  }

  function buildBulkDeleteItemsRequest() {
    console.log(
      'Starting to process the batch delete request for the transactions %j',
      result[0].Count,
      ' and for the budgets ',
      result[1].Count,
    );
    const requestArr = [];

    // Remove Category
    requestArr.push({
      DeleteRequest: {
        Key: {
          pk: walletId,
          sk: event['body-json'].category,
        },
      },
    });

    // Result contains both Transaction and Budget items
    Object.keys(result).forEach((items) => {
    // Iterate through Transaction Item first and then Budget Item
      Object.keys(items.Items).forEach((item) => {
      // If transactions and budgets contain the category.
        if (util.isEqual(item.category, event['body-json'].category)) {
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
      });
    });

    // Split array into sizes of 25
    deleteRequests = helper.chunkArrayInGroups(requestArr, 25);

    // Push Events  to be executed in bulk
    events = pushToBuildDelete(events, deleteRequests, DB);
    return events;
  }

  events = buildBulkDeleteItemsRequest(result, walletId, event, events, DB);

  await Promise.all(events).then(
    () => {
      console.log('successfully deleted all the items');
    },
    (err) => {
      throw new Error(`Unable to delete all the items ${err}`);
    },
  );
  return events;
}

DeleteHelper.prototype.bulkDeleteItems = bulkDeleteItems;

// Export object
module.exports = new DeleteHelper();
