const Helper = () => {};

const deleteItems = require('../delete/delete-items');
const transaction = require('../fetch/transactions');
const recurringTransaction = require('../fetch/recurring-transactions');

async function fetchAccountsTransactionData(
  walletId,
  DB,
) {
  const events = [];
  let result;
  events.push(transaction.getTransactionItems(walletId, DB));
  events.push(recurringTransaction.getRecurringTransactionItems(walletId, DB));

  await Promise.all(events).then(
    (res) => {
      console.log('successfully fetched all the items');
      result = res;
    },
    (err) => {
      throw new Error(`Unable to delete the account ${err}`);
    },
  );
  return result;
}

// Splits array into chunks
const chunkArrayInGroups = (arr, size) => {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
};

const isEqual = (obj1, obj2) => {
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
    return true;
  }
  return false;
};

async function deleteAccountsAndItsData(deleteRequests) {
  const events = [];
  Object.keys(deleteRequests).forEach((deleteRequest) => {
    const params = {};
    params.RequestItems = {};
    params.RequestItems.blitzbudget = deleteRequest;
    console.log(
      'The delete request is in batch  with length %j',
      params.RequestItems.blitzbudget.length,
    );
    // Delete Items in batch
    events.push(deleteItems.deleteItems(params));
  });

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

Helper.prototype.logResultIfEmpty = (result, walletId) => {
  if (result[0].Count === 0 && result[1].Count === 0) {
    console.log('There are no items to delete for the wallet %j', walletId);
  }
};

Helper.prototype.buildDeleteRequest = (result, walletId, accountToDelete) => {
  console.log(
    'Starting to process the batch delete request for the transactions %j',
    result[0].Count,
    ' and for the budgets ',
    result[1].Count,
  );
  const requestArr = [];

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
  Object.keys(result).forEach((items) => {
    // Iterate through Transaction Item first and then recurringtransactions Item
    Object.keys(items.Items).forEach((item) => {
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
    });
  });

  // Split array into sizes of 25
  const deleteRequests = chunkArrayInGroups(requestArr, 25);
  return deleteRequests;
};

Helper.prototype.fetchAccountsTransactionData = fetchAccountsTransactionData;
Helper.prototype.deleteAccountsAndItsData = deleteAccountsAndItsData;
Helper.prototype.isEqual = isEqual;
Helper.prototype.chunkArrayInGroups = chunkArrayInGroups;

// Export object
module.exports = new Helper();
