const util = require('./util');
const deleteRequestParameter = require('../create-parameter/delete-request');

module.exports.buildDeleteRequest = (response, walletId, accountId) => {
  console.log(
    'Starting to process the batch delete request for the transactions %j',
    response[0].Count,
    ' and for the RecurringTransactions ',
    response[1].Count,
  );
  const requestArray = [];

  // Remove Account
  requestArray.push(deleteRequestParameter.createParameter(walletId, accountId));

  // Result contains both Transaction and RecurringTransactions items
  response.forEach((singleResponse) => {
    // Iterate through Transaction Item first and then recurringtransactions Item
    singleResponse.Items.forEach((item) => {
      // If transactions and RecurringTransactions contain the category.
      if (util.isEqual(item.account, accountId)) {
        console.log('Building the delete params for the item %j', item.sk);
        requestArray.push(deleteRequestParameter.createParameter(walletId, item.sk));
      }
    });
  });

  // Split array into sizes of 25
  const deleteRequests = util.chunkArrayInGroups(requestArray, 25);
  return deleteRequests;
};
