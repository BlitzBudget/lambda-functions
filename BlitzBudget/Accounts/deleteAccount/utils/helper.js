var helper = function () {};

const deleteItems = require('delete/delete-items');
const transaction = require('fetch/transactions');
const recurringTransaction = require('fetch/recurring-transactions');

async function fetchAccountsTransactionsAndRecurringTrans(
  events,
  walletId,
  result,
  DB
) {
  events.push(transaction.getTransactionItems(walletId, DB));
  events.push(recurringTransaction.getRecurringTransactionItems(walletId, DB));

  await Promise.all(events).then(
    function (res) {
      console.log('successfully fetched all the items');
      result = res;
    },
    function (err) {
      throw new Error('Unable to delete the account ' + err);
    }
  );
  return result;
}

// Splits array into chunks
let chunkArrayInGroups = (arr, size) => {
  var myArray = [];
  for (var i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
};

let isEqual = (obj1, obj2) => {
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
    return true;
  }
  return false;
};

async function deleteAccountsAndItsData(events, deleteRequests) {
  events = [];
  for (const deleteRequest of deleteRequests) {
    let params = {};
    params.RequestItems = {};
    params.RequestItems.blitzbudget = deleteRequest;
    console.log(
      'The delete request is in batch  with length %j',
      params.RequestItems.blitzbudget.length
    );
    // Delete Items in batch
    events.push(deleteItems.deleteItems(params));
  }

  await Promise.all(events).then(
    function (result) {
      console.log('successfully deleted all the items');
    },
    function (err) {
      throw new Error('Unable to delete all the items ' + err);
    }
  );
  return events;
}

helper.prototype.logResultIfEmpty = (result, walletId) => {
  if (result[0].Count == 0 && result[1].Count == 0) {
    console.log('There are no items to delete for the wallet %j', walletId);
  }
};

helper.prototype.buildDeleteRequest = (result, walletId, accountToDelete) => {
  console.log(
    'Starting to process the batch delete request for the transactions %j',
    result[0].Count,
    ' and for the budgets ',
    result[1].Count
  );
  let requestArr = [];

  // Remove Account
  requestArr.push({
    DeleteRequest: {
      Key: {
        pk: walletId,
        sk: accountToDelete,
      },
    },
  });

  // Result contains both Transaction and RecurringTransactions items
  for (const items of result) {
    // Iterate through Transaction Item first and then recurringtransactions Item
    for (const item of items.Items) {
      // If transactions and budgets contain the category.
      if (isEqual(item.account, accountToDelete)) {
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
    }
  }

  // Split array into sizes of 25
  let deleteRequests = chunkArrayInGroups(requestArr, 25);
  return deleteRequests;
};

helper.prototype.fetchAccountsTransactionsAndRecurringTrans = fetchAccountsTransactionsAndRecurringTrans(
  events,
  walletId,
  result
);
helper.prototype.deleteAccountsAndItsData = deleteAccountsAndItsData(
  events,
  deleteRequests
);
helper.prototype.isEqual = isEqual;
helper.prototype.chunkArrayInGroups = chunkArrayInGroups;

// Export object
module.exports = new helper();
