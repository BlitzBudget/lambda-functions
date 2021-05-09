function AddHelper() {}

const fetchHelper = require('./fetch-helper');
const util = require('./util');
const addTransaction = require('../tools/transaction-helper');
const categoryParameter = require('../create-parameter/category');
const batchWriteItems = require('../add/batch-write');

async function calculateCategoriesToAdd(
  category,
  walletId,
  categoryType,
  categoryName,
  categoryMap,
  createItemsArray,
  datesMap,
  events,
  documentClient,
) {
  const categoriesMap = categoryMap;
  fetchHelper.pushAllCategoriesToFetch(
    category,
    walletId,
    categoryType,
    categoryName,
    documentClient,
    createItemsArray,
    events,
  );

  /*
   * Publish events to get category data
   */
  await Promise.all(events).then(
    (result) => {
      console.log('Processing Categories to create');
      result.forEach((categoryItem) => {
        categoriesMap[categoryItem.dateMeantFor] = categoryItem.sortKey;
        createItemsArray.push(
          categoryParameter.createParameter(
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

function createAllItemsInBatch(putRequests, documentClient, events) {
  putRequests.forEach((putRequest) => {
    const params = {};
    params.RequestItems = {};
    params.RequestItems.blitzbudget = putRequest;
    console.log(
      'The put request is in batch  with length %j',
      params.RequestItems.blitzbudget.length,
    );
    // Delete Items in batch
    events.push(batchWriteItems.batchWriteItems(params, documentClient));
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
  createItemsArray,
  datesMap,
  categoryMap,
  event,
  documentClient,
  events,
) {
  console.log(
    ' The number of dates and categories to create are %j',
    createItemsArray.length,
  );
  // Add all transactions
  addTransaction.constructTransactions(
    datesMap,
    categoryMap,
    event,
    createItemsArray,
  );
  console.log(
    ' The number of transactions to create are %j',
    createItemsArray.length,
  );

  // Split array into sizes of 25
  const putRequests = util.chunkArrayInGroups(createItemsArray, 25);

  // Push Events  to be executed in bulk
  createAllItemsInBatch(putRequests, documentClient, events);
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
  createItemsArray,
  datesMap,
  events,
  documentClient,
) {
  await calculateCategoriesToAdd(
    category,
    walletId,
    categoryType,
    categoryName,
    categoryMap,
    createItemsArray,
    datesMap,
    events,
    documentClient,
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
