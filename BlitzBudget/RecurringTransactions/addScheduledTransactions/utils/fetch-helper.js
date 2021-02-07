var fetchHelper = function () { };

const fetchCategory = require('../fetch/category');
const fetchDate = require('../fetch/category');
const dateParam = require('../create-parameters/date');

function pushAllCategoriesToFetch(category, walletId, categoryType, categoryName, DB) {
    for (const dateMeantFor of nextSchArray) {
        /*
         * Check if 2020-03 == 2020-02
         */
        if (helper.isNotEqual(dateMeantFor, category.substring(9, 16))) {
            events.push(fetchCategory.getCategoryData(walletId, dateMeantFor, categoryType, categoryName, category, DB));
        }
    }
}

/*
* Publish events to get date data
*/
async function calculateAndAddAllDates(addItemArray, walletId, datesMap, events) {
    fetchDatesForWallet(walletId, events);

    await Promise.all(events).then(function (result) {
        events = [];
        console.log("Successfully fetched all the relevant information %j", JSON.stringify(result));

        /*
         * Calculate Date
         */
        calculateDates(result, addItemArray, walletId, datesMap);

    }, function (err) {
        throw new Error("Unable to fetch the date for the recurring transaction" + err);
    });
}


function calculateDates(result, addItemArray, walletId, datesMap) {
    for (const dateObj of result) {

        /*
         * If Date is empty then
         */
        if (helper.includesStr(nextSchArray, dateObj.dateToCreate)) {
            let dateToCreate = new Date();
            dateToCreate.setFullYear(dateObj.dateToCreate.substring(0, 4));
            let month = parseInt(dateObj.dateToCreate.substring(5, 7)) - 1;
            dateToCreate.setMonth(month);
            let sk = "Date#" + dateToCreate.toISOString();
            addItemArray.push(dateParam.buildParamsForDate(walletId, sk));
            /*
             * Build date object to place the date in transactions
             */
            dateObj.Date = [];
            dateObj.Date.push({
                'sk': sk
            });
        }

        /*
         * Populate to dates map
         */
        if (dateObj.Date) {
            datesMap[dateObj.Date[0].sk.substring(5, 12)] = (dateObj.Date[0].sk);
        }

    }
}

/*
* Fetch available dates
*/
function fetchDatesForWallet(walletId, events, DB) {
    for (const dateMeantFor of nextSchArray) {
        events.push(fetchDate.getDateData(walletId, dateMeantFor,DB));
    }
}

fetchHelper.prototype.pushAllCategoriesToFetch = pushAllCategoriesToFetch;
fetchHelper.prototype.calculateAndAddAllDates = calculateAndAddAllDates;
// Export object
module.exports = new fetchHelper(); 