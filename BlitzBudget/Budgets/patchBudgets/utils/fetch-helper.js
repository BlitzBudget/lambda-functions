function FetchHelper() {}

const util = require('./util');
const helper = require('./helper');
const budget = require('../fetch/budget');
const category = require('../fetch/category');

async function fetchBudget(
  event,
  documentClient,
) {
  const today = helper.formulateDateFromRequest(event);
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

async function fetchCategory(event, today, documentClient) {
  let categoryId;
  await category.getCategoryData(event, today, documentClient).then(
    (result) => {
      if (util.isNotEmpty(result.Category)) {
        categoryId = result.Category.sk;
      }
    },
    (err) => {
      throw new Error(`Unable to get the category ${err}`);
    },
  );
  return categoryId;
}

FetchHelper.prototype.fetchBudget = fetchBudget;
FetchHelper.prototype.fetchCategory = fetchCategory;
// Export object
module.exports = new FetchHelper();
