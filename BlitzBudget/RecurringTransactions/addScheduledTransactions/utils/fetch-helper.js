function FetchHelper() {}

const util = require('./util');
const helper = require('./helper');
const fetchCategory = require('../fetch/category');
const fetchDate = require('../fetch/date');
const dateParameter = require('../create-parameter/date');

function pushAllCategoriesToFetch(
  category,
  walletId,
  categoryType,
  categoryName,
  documentClient,
  datesToCreateTransactions,
  events,
) {
  datesToCreateTransactions.forEach((dateMeantFor) => {
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
function fetchDatesForWallet(
  walletId, fetchDateEvents, documentClient, futureTransactionsToCreate,
) {
  futureTransactionsToCreate.forEach((dateMeantFor) => {
    fetchDateEvents.push(fetchDate.getDateData(walletId, dateMeantFor, documentClient));
  });
}

function calculateDates(fetchDatesResult, futureTransactionsToCreate, walletId, datesMap) {
  fetchDatesResult.forEach((dateObj) => {
    const dateMap = datesMap;
    const date = dateObj;
    /*
     * If Date is empty then
     */
    if (util.includesStr(futureTransactionsToCreate, date.dateToCreate)) {
      const dateToCreate = helper.convertToDate(date);
      const sk = `Date#${dateToCreate.toISOString()}`;
      futureTransactionsToCreate.push(dateParameter.createParameter(walletId, sk));
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
    if (date.Date) {
      dateMap[dateObj.Date[0].sk.substring(5, 12)] = date.Date[0].sk;
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
  documentClient,
) {
  const fetchDateEvents = [];
  fetchDatesForWallet(walletId, fetchDateEvents, documentClient, futureTransactionsToCreate);

  await Promise.all(fetchDateEvents).then(
    (fetchDatesResult) => {
      console.log(
        'Successfully fetched all the relevant information %j',
        JSON.stringify(fetchDatesResult),
      );

      /*
       * Calculate Date
       */
      calculateDates(fetchDatesResult, futureTransactionsToCreate, walletId, datesMap);
    },
    (err) => {
      throw new Error(
        `Unable to fetch the date for the recurring transaction${err}`,
      );
    },
  );
}

FetchHelper.prototype.pushAllCategoriesToFetch = pushAllCategoriesToFetch;
FetchHelper.prototype.calculateAndAddAllDates = calculateAndAddAllDates;
// Export object
module.exports = new FetchHelper();
