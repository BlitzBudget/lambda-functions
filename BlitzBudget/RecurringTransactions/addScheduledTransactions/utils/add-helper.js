const AddHelper = () => {};

const fetchHelper = require('./fetch-helper');
const helper = require('./helper');
const addTransaction = require('../create-parameters/transaction');
const addCategoryParam = require('../create-parameters/category');
const batchWriteItems = require('../add/batch-write');

async function calculateCategoriesToAdd(
  category,
  walletId,
  categoryType,
  categoryName,
  categoryMap,
  addItemArray,
  datesMap,
  events,
  DB,
  nextSchArray,
) {
  const categoriesMap = categoryMap;
  fetchHelper.pushAllCategoriesToFetch(
    category,
    walletId,
    categoryType,
    categoryName,
    DB,
    nextSchArray,
    events,
  );

  /*
   * Publish events to get category data
   */
  await Promise.all(events).then(
    (result) => {
      console.log('Processing Categories to create');
      Object.keys(result).forEach((categoryItem) => {
        categoriesMap[categoryItem.dateMeantFor] = categoryItem.sortKey;
        addItemArray.push(
          addCategoryParam.buildParamsForCategory(
            walletId,
            categoryItem.sortKey,
            categoryType,
            categoryName,
            datesMap[categoryItem.dateMeantFor],
          ),
        );
      });
    },
    (err) => {
      throw new Error(
        `Unable to get the category for the recurring transaction${err}`,
      );
    },
  );

  return [];
}

function createAllItemsInBatch(putRequests, DB, events) {
  Object.keys(putRequests).forEach((putRequest) => {
    const params = {};
    params.RequestItems = {};
    params.RequestItems.blitzbudget = putRequest;
    console.log(
      'The put request is in batch  with length %j',
      params.RequestItems.blitzbudget.length,
    );
    // Delete Items in batch
    events.push(batchWriteItems.batchWriteItems(params, DB));
  });
}

async function addAllCategories(events) {
  await Promise.all(events).then(
    () => {},
    (err) => {
      throw new Error(
        `Unable to update the recurring transactions field ${err}`,
      );
    },
  );

  return [];
}

function constructRequestAndCreateItems(
  addItemArray,
  datesMap,
  categoryMap,
  event,
  DB,
  events,
) {
  console.log(
    ' The number of dates and categories to create are %j',
    addItemArray.length,
  );
  // Add all transactions
  addTransaction.constructTransactions(
    datesMap,
    categoryMap,
    event,
    addItemArray,
  );
  console.log(
    ' The number of transactions to create are %j',
    addItemArray.length,
  );

  // Split array into sizes of 25
  const putRequests = helper.chunkArrayInGroups(addItemArray, 25);

  // Push Events  to be executed in bulk
  createAllItemsInBatch(putRequests, DB, events);
}

/*
 * Start processing categories
 */
async function calculateAndAddAllCategories(
  category,
  walletId,
  categoryType,
  categoryName,
  categoryMap,
  addItemArray,
  datesMap,
  events,
  DB,
  nextSchArray,
) {
  await calculateCategoriesToAdd(
    category,
    walletId,
    categoryType,
    categoryName,
    categoryMap,
    addItemArray,
    datesMap,
    events,
    DB,
    nextSchArray,
  );

  /*
   * Add all categories first
   */
  await addAllCategories(events);
  return [];
}

AddHelper.prototype.constructRequestAndCreateItems = constructRequestAndCreateItems;
AddHelper.prototype.calculateAndAddAllCategories = calculateAndAddAllCategories;

// Export object
module.exports = new AddHelper();
