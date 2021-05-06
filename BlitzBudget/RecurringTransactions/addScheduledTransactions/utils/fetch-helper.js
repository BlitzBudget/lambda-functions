function FetchHelper() {}

const util = require('./util');
const fetchCategory = require('../fetch/category');
const fetchDate = require('../fetch/date');
const dateParam = require('../create-parameter/date');

function pushAllCategoriesToFetch(
  category,
  walletId,
  categoryType,
  categoryName,
  documentClient,
  futureTransactionsToCreate,
  events,
) {
  futureTransactionsToCreate.forEach((dateMeantFor) => {
    /*
     * Check if 2020-03 ===  2020-02
     */
    if (util.isNotEqual(dateMeantFor, category.substring(9, 16))) {
      events.push(
        fetchCategory.getCategoryData(
          walletId,
          dateMeantFor,
          categoryType,
          categoryName,
          category,
          documentClient,
        ),
      );
    }
  });
}

/*
 * Fetch available dates
 */
function fetchDatesForWallet(walletId, events, documentClient, futureTransactionsToCreate) {
  futureTransactionsToCreate.forEach((dateMeantFor) => {
    events.push(fetchDate.getDateData(walletId, dateMeantFor, documentClient));
  });
}

function calculateDates(result, addItemArray, walletId, datesMap, futureTransactionsToCreate) {
  Object.keys(result).forEach((dateObj) => {
    const dateMap = datesMap;
    const date = dateObj;
    /*
     * If Date is empty then
     */
    if (util.includesStr(futureTransactionsToCreate, dateObj.dateToCreate)) {
      const dateToCreate = new Date();
      dateToCreate.setFullYear(dateObj.dateToCreate.substring(0, 4));
      const month = parseInt(dateObj.dateToCreate.substring(5, 7), 10) - 1;
      dateToCreate.setMonth(month);
      const sk = `Date#${dateToCreate.toISOString()}`;
      addItemArray.push(dateParam.buildParamsForDate(walletId, sk));
      /*
       * Build date object to place the date in transactions
       */
      date.Date = [];
      date.Date.push({
        sk,
      });
    }

    /*
     * Populate to dates map
     */
    if (dateObj.Date) {
      dateMap[dateObj.Date[0].sk.substring(5, 12)] = dateObj.Date[0].sk;
    }
  });
}

/*
 * Publish events to get date data
 */
async function calculateAndAddAllDates(
  futureTransactionsToCreate,
  walletId,
  datesMap,
  events,
  documentClient,
) {
  fetchDatesForWallet(walletId, events, documentClient, futureTransactionsToCreate);

  await Promise.all(events).then(
    (result) => {
      console.log(
        'Successfully fetched all the relevant information %j',
        JSON.stringify(result),
      );

      /*
       * Calculate Date
       */
      calculateDates(result, futureTransactionsToCreate, walletId, datesMap);
    },
    (err) => {
      throw new Error(
        `Unable to fetch the date for the recurring transaction${err}`,
      );
    },
  );

  return [];
}

FetchHelper.prototype.pushAllCategoriesToFetch = pushAllCategoriesToFetch;
FetchHelper.prototype.calculateAndAddAllDates = calculateAndAddAllDates;
// Export object
module.exports = new FetchHelper();
