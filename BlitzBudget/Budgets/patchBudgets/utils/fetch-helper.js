function FetchHelper() {}

const util = require('./util');
const budget = require('../fetch/budget');

async function checkIfBudgetAlreadyPresent(
  categoryName,
  checkIfBudgetIsPresent,
  event,
  documentClient,
) {
  if (util.isNotEmpty(categoryName) && checkIfBudgetIsPresent) {
    const today = new Date();
    today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
    today.setMonth(
      parseInt(event['body-json'].dateMeantFor.substring(10, 12), 10) - 1,
    );
    // Check if the budget is present for the mentioned category
    await budget.getBudgetsItem(today, event, documentClient).then(
      (result) => {
        if (util.isNotEmpty(result.Budget)) {
          throw new Error('Unable to create a new budget for an existing category');
        }
      },
      (err) => {
        throw new Error(`Unable to get the budget item to check if the budget is present ${err}`);
      },
    );
  }
}

FetchHelper.prototype.checkIfBudgetAlreadyPresent = checkIfBudgetAlreadyPresent;
// Export object
module.exports = new FetchHelper();
