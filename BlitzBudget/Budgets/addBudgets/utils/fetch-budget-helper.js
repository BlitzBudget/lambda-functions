const util = require('./util');
const fetchBudget = require('../fetch/budget.js');

module.exports.checkIfBudgetAlreadyPresent = async (
  categoryName,
  checkIfBudgetIsPresent,
  today,
  event,
) => {
  let addNewBudget = true;
  if (util.isNotEmpty(categoryName) && checkIfBudgetIsPresent) {
    await fetchBudget.getBudgetsItem(today, event).then(
      (result) => {
        if (util.isNotEmpty(result.Budget)) {
          addNewBudget = false;
        }
      },
      (err) => {
        throw new Error(
          `Unable to get the budget item to check if the budget is present ${
            err}`,
        );
      },
    );
  }
  return addNewBudget;
};
