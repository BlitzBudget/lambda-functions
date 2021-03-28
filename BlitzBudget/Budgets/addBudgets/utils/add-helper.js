const AddHelper = () => {};

const addCategory = require('../add/category.js');
const addDate = require('../add/date.js');
const budget = require('../add/budget.js');
const fetchHelper = require('./fetch-budget-helper.js');

async function addBudget(addANewBudget, event, documentClient) {
  if (!addANewBudget) {
    return;
  }

  await budget.addNewBudget(event, documentClient).then(
    () => {
      console.log('successfully saved the new Budget');
    },
    (err) => {
      throw new Error(`Unable to add the Budget ${err}`);
    },
  );
}

/*
 * Check if the budget is present for a newly created category
 * For Simultaneous cross device creation compatability
 */
async function addBudgetIfNotAlreadyPresent(
  categoryName,
  checkIfBudgetIsPresent,
  today,
  event,
  documentClient,
) {
  const addNewBudget = await fetchHelper.checkIfBudgetAlreadyPresent(
    categoryName,
    checkIfBudgetIsPresent,
    today,
    event,
  );

  /*
   * Only if the new budget has to be created
   */
  const response = await addBudget(addNewBudget, event, documentClient);
  return response.budgetId;
}

AddHelper.prototype.createANewCategoryItem = (event, categoryId, categoryName, events) => {
  const request = event;
  request['body-json'].category = categoryId;
  request['body-json'].categoryName = categoryName;
  // If it is a newly created category then the category total is 0
  request['body-json'].used = 0;
  events.push(addCategory.createCategoryItem(request, categoryId, categoryName));
  // Do not check the budget for a newly created category
  return false;
};

AddHelper.prototype.createANewDate = (dateMeantFor, today, event) => {
  const events = [];
  const newDateId = `Date#${today.toISOString()}`;
  console.log('Date entry is empty so creating the date object');
  events.push(addDate.createDateItem(event, newDateId));
  return { dateMeantFor, events };
};

AddHelper.prototype.addBudgetIfNotAlreadyPresent = addBudgetIfNotAlreadyPresent;

// Export object
module.exports = new AddHelper();
