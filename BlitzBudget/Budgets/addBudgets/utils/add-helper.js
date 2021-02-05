var addHelper = function () { };
const addCategory = require('../add/category.js');
const addDate = require('../add/date.js');
const budget = require('../add/budget.js');
const fetchHelper = require('../utils/fetch-helper.js');

/*
* Check if the budget is present for a newly created category
* For Simultaneous cross device creation compatability
*/
async function addBudgetIfNotAlreadyPresent(categoryName, checkIfBudgetIsPresent, today, event) {
    let addNewBudgetBl = await fetchHelper.checkIfBudgetAlreadyPresent(categoryName, checkIfBudgetIsPresent, today, event);

    /*
     * Only if the new budget has to be created
     */
    await addBudget(addNewBudgetBl, event);
}

async function addBudget(addNewBudgetBl, event) {

    if (!addNewBudgetBl) {
        return;
    }

    let events = [];
    events.push(budget.addNewBudget(event));
    
    /*
     * Only if there are items to be added
     */
    await Promise.all(events).then(function () {
        console.log("successfully saved the new Budget");
    }, function (err) {
        throw new Error("Unable to add the Budget " + err);
    });
}

addHelper.prototype.createANewCategoryItem = (event, categoryId, events) => {
    event['body-json'].category = categoryId;
    event['body-json'].categoryName = categoryName;
    // If it is a newly created category then the category total is 0
    event['body-json'].used = 0;
    events.push(addCategory.createCategoryItem(event, categoryId, categoryName));
    // Do not check the budget for a newly created category
    checkIfBudgetIsPresent = false;
    return checkIfBudgetIsPresent;
}

addHelper.prototype.createANewDate = (dateMeantFor, today, events, event) => {
    dateMeantFor = "Date#" + today.toISOString();
    console.log("Date entry is empty so creating the date object");
    events.push(addDate.createDateData(event, dateMeantFor));
    return dateMeantFor;
}

addHelper.prototype.addBudgetIfNotAlreadyPresent = addBudgetIfNotAlreadyPresent;

// Export object
module.exports = new addHelper();