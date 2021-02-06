function pushAllCategoriesToFetch(category, walletId, categoryType, categoryName) {
    for (const dateMeantFor of nextSchArray) {
        /*
         * Check if 2020-03 == 2020-02
         */
        if (isNotEqual(dateMeantFor, category.substring(9, 16))) {
            events.push(getCategoryData(walletId, dateMeantFor, categoryType, categoryName, category));
        }
    }
}

/*
* Publish events to get date data
*/
async function calculateAndAddAllDates(requestArr, walletId, datesMap) {
    await Promise.all(events).then(function (result) {
        events = [];
        console.log("Successfully fetched all the relevant information %j", JSON.stringify(result));

        /*
         * Calculate Date
         */
        calculateDates(result, requestArr, walletId, datesMap);

    }, function (err) {
        throw new Error("Unable to fetch the date for the recurring transaction" + err);
    });
}


function calculateDates(result, requestArr, walletId, datesMap) {
    for (const dateObj of result) {

        /*
         * If Date is empty then
         */
        if (includesStr(nextSchArray, dateObj.dateToCreate)) {
            let dateToCreate = new Date();
            dateToCreate.setFullYear(dateObj.dateToCreate.substring(0, 4));
            let month = parseInt(dateObj.dateToCreate.substring(5, 7)) - 1;
            dateToCreate.setMonth(month);
            let sk = "Date#" + dateToCreate.toISOString();
            requestArr.push(buildParamsForDate(walletId, sk));
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
function fetchDatesForWallet(walletId) {
    for (const dateMeantFor of nextSchArray) {
        events.push(getDateData(walletId, dateMeantFor));
    }
}