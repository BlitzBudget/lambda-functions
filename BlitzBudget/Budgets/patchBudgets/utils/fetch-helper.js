var fetchHelper = function () { };

const helper = require('helper');
const budget = require('../fetch/budget');

async function checkIfBudgetAlreadyPresent(categoryName, checkIfBudgetIsPresent, event, docClient) {
    if (helper.isNotEmpty(categoryName) && checkIfBudgetIsPresent) {
        let today = new Date();
        today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
        today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) - 1);
        // Check if the budget is present for the mentioned category
        await budget.getBudgetsItem(today, event, docClient).then(function (result) {
            if (helper.isNotEmpty(result.Budget)) {
                throw new Error("Unable to create a new budget for an existing category");
            }
        }, function (err) {
            throw new Error("Unable to get the budget item to check if the budget is present " + err);
        });
    }
}

fetchHelper.prototype.checkIfBudgetAlreadyPresent = checkIfBudgetAlreadyPresent;
// Export object
module.exports = new fetchHelper();