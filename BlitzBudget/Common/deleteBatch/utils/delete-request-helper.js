const deleteItems = require('../delete/items');

module.exports.bulkDeleteRequest = (deleteRequests, events, DB) => {
  deleteRequests.forEach((deleteRequest) => {
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
};
