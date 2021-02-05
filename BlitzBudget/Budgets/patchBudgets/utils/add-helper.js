var addHelper = function () { };

const helper = require('helper');
const category = require('../fetch/category');
const addCategory = require('../add/category');

async function addNewCategoryIfNotPresent(categoryId, event, today, categoryName, events, checkIfBudgetIsPresent, docClient) {
    await category.getCategoryData(event, today, docClient).then(function (result) {
        if (helper.isNotEmpty(result.Category)) {
            console.log("successfully assigned the existing category %j", result.Category.sk);
            event['body-json'].category = result.Category.sk;
        } else {
            // Assign Category to create the transactions with the category ID
            event['body-json'].category = categoryId;
            event['body-json'].categoryName = categoryName;
            // If it is a newly created category then the category total is 0
            event['body-json'].used = 0;
            events.push(addCategory.createCategoryItem(event, categoryId, categoryName, docClient));
            // Do not check the budget for a newly created category
            checkIfBudgetIsPresent = false;
        }
    }, function (err) {
        throw new Error("Unable to get the category " + err);
    });
    return checkIfBudgetIsPresent;
}

/*
* If category Id is not present
*/
async function addANewCategoryIfNotPresent(event, checkIfBudgetIsPresent, events, docClient) {
    let categoryName = event['body-json'].category;
    if (helper.isNotEmpty(categoryName) && helper.notIncludesStr(categoryName, 'Category#')) {
        let today = helper.formulateDateFromRequest(event);
        let categoryId = "Category#" + today.toISOString();

        /*
        * Check if category is present before adding them
        */
        checkIfBudgetIsPresent = await addNewCategoryIfNotPresent(categoryId, event, today, categoryName, events, checkIfBudgetIsPresent, docClient);
    }
    return { categoryName, checkIfBudgetIsPresent };
}

addHelper.prototype.addANewCategoryIfNotPresent = addANewCategoryIfNotPresent;
// Export object
module.exports = new addHelper();