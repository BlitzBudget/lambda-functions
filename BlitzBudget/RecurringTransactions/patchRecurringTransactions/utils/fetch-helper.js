var fetchHelper = function () { };
const helper = require('helper');
const addHelper = require('add-helper');
const fetchCategory = require('../fetch/category');

/*
* If category Id is not present
*/
async function calculateAndFetchCategory(event, events, docClient) {
    let categoryName = event['body-json'].category;
    if (helper.isNotEmpty(categoryName) && helper.notIncludesStr(categoryName, 'Category#')) {
        let today = new Date();
        today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
        today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) - 1);
        let categoryId = "Category#" + today.toISOString();

        /*
         * Check if category is present before adding them
         */
        await fetchOrCreateANewCategory(categoryId, event, today, categoryName, events, docClient);
    }
}

async function fetchOrCreateANewCategory(categoryId, event, today, categoryName, events, docClient) {
    await fetchCategory.getCategoryData(docClient, event, today).then(function (result) {
        if (helper.isNotEmpty(result.Category)) {
            console.log("Successfully assigned the existing category %j", result.Category.sk);
            event['body-json'].category = result.Category.sk;
        } else {
            // Assign Category to create the transactions with the category ID
            addHelper.createANewCategory(event, categoryId, categoryName, events, docClient);
        }
    }, function (err) {
        throw new Error("Unable to add the Budget " + err);
    });
}

fetchHelper.prototype.calculateAndFetchCategory = calculateAndFetchCategory;
// Export object
module.exports = new fetchHelper(); 
