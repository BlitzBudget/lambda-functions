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
  datesToCreateTransactions,
  datesMap,
  documentClient,
) {
  const categoriesMap = categoryMap;
  const events = [];
  fetchHelper.pushAllCategoriesToFetch(
    category,
    walletId,
    categoryType,
    categoryName,
    documentClient,
    datesToCreateTransactions,
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
        datesToCreateTransactions.push(
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
}

function createAllItemsInBatch(putRequests, documentClient, datesToCreateTransactions) {
  putRequests.forEach((putRequest) => {
    const params = {};
    params.RequestItems = {};
    params.RequestItems.blitzbudget = putRequest;
    console.log(
      'The put request is in batch  with length %j',
      params.RequestItems.blitzbudget.length,
    );
    // Delete Items in batch
    datesToCreateTransactions.push(batchWriteItems.batchWriteItems(params, documentClient));
  });
}

function constructRequestAndCreateItems(
  datesToCreateTransactions,
  datesMap,
  categoryMap,
  event,
  documentClient,
) {
  console.log(
    ' The number of dates and categories to create are %j',
    datesToCreateTransactions.length,
  );
  // Add all transactions
  addTransaction.constructTransactions(
    datesMap,
    categoryMap,
    event,
    datesToCreateTransactions,
  );
  console.log(
    ' The number of transactions to create are %j',
    datesToCreateTransactions.length,
  );

  // Split array into sizes of 25
  const putRequests = util.chunkArrayInGroups(datesToCreateTransactions, 25);

  // Push Events  to be executed in bulk
  createAllItemsInBatch(putRequests, documentClient, datesToCreateTransactions);
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
  datesToCreateTransactions,
  datesMap,
  documentClient,
) {
  await calculateCategoriesToAdd(
    category,
    walletId,
    categoryType,
    categoryName,
    categoryMap,
    datesToCreateTransactions,
    datesMap,
    documentClient,
  );
}

AddHelper.prototype.constructRequestAndCreateItems = constructRequestAndCreateItems;
AddHelper.prototype.calculateAndAddAllCategories = calculateAndAddAllCategories;

// Export object
module.exports = new AddHelper();
