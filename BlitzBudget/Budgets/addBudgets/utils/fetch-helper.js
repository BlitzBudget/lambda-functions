var fetchHelper = function () { };
const helper = require('helper');
const addHelper = require('helper');
const fetchDate = require('../fetch/date.js');
const fetchBudget = require('../fetch/budget.js');
const fetchCategory = require('../fetch/category.js');

async function fetchCategoryIdIfNotProvided(event, today, events, checkIfBudgetIsPresent) {
    let categoryName = event['body-json'].category;
    if (helper.isNotEmpty(categoryName) && helper.notIncludesStr(categoryName, 'Category#')) {
        let categoryId = "Category#" + today.toISOString();

        /*
         * Check if category is present before adding them
         */
        await fetchCategory.getCategoryData(categoryId, event, today).then(function (result) {
            if (helper.isNotEmpty(result.Category)) {
                console.log("successfully assigned the existing category %j", result.Category.sk);
                event['body-json'].category = result.Category.sk;
            } else {
                checkIfBudgetIsPresent = addHelper.createANewCategoryItem(event, categoryId, categoryName, events, checkIfBudgetIsPresent);
            }
        }, function (err) {
            throw new Error("Unable to get the category " + err);
        });
    }
    return { categoryName, checkIfBudgetIsPresent };
}

async function fetchDateIdIfNotProvided(dateMeantFor, event, walletId, events) {
    if (helper.notIncludesStr(dateMeantFor, 'Date#')) {
        console.log("The date is %j", dateMeantFor);
        let today = new Date(event['body-json'].dateMeantFor);

        /*
         * Check if date is present before adding them
         */
        await fetchDate.getDateData(walletId, today).then(function (result) {
            if (helper.isNotEmpty(result.Date)) {
                console.log("successfully assigned the exissting date %j", result.Date[0].sk);
                dateMeantFor = result.Date[0].sk;
            } else {
                dateMeantFor = addHelper.createANewDate(dateMeantFor, today, events, event);
            }
            // Assign Date meant for to create the transactions with the date ID
            event['body-json'].dateMeantFor = dateMeantFor;
        }, function (err) {
            throw new Error("Unable to add the Budget " + err);
        });
    }
    return dateMeantFor;
}

async function checkIfBudgetAlreadyPresent(categoryName, checkIfBudgetIsPresent, today, event) {
    let addNewBudgetBl = true;
    if (helper.isNotEmpty(categoryName) && checkIfBudgetIsPresent) {
        // Check if the budget is present for the mentioned category
        await fetchBudget.getBudgetsItem(today, event).then(function (result) {
            if (helper.isNotEmpty(result.Budget)) {
                addNewBudgetBl = false;
                event['body-json'].budgetId = result.Budget.sk;
            }
        }, function (err) {
            throw new Error("Unable to get the budget item to check if the budget is present " + err);
        });
    }
    return addNewBudgetBl;
}

/**
 * Convert DateMeantFor to Date
 */
async function calculateAndFetchCategory(event, categoryName, checkIfBudgetIsPresent, events) {
    let today = helper.convertToDate(event);

    /*
     * If category Id is not present
     */
    ({ categoryName, checkIfBudgetIsPresent } = await fetchCategoryIdIfNotProvided(event, today, events, checkIfBudgetIsPresent));
    return { today, categoryName, checkIfBudgetIsPresent };
}

/*
* Start date and end date is present without datemeantfor
*/
async function calculateAndFetchDate(dateMeantFor, startsWithDate, endsWithDate, event, walletId, events) {
    dateMeantFor = helper.calculateDateMeantFor(startsWithDate, endsWithDate, event, dateMeantFor);

    /*
     * If Date Id is not present
     */
    return await fetchDateIdIfNotProvided(dateMeantFor, event, walletId, events);;
}

fetchHelper.prototype.calculateAndFetchDate = calculateAndFetchDate;
fetchHelper.prototype.calculateAndFetchCategory = calculateAndFetchCategory;
fetchHelper.prototype.checkIfBudgetAlreadyPresent = checkIfBudgetAlreadyPresent;

// Export object
module.exports = new fetchHelper();