const AddHelper = () => {};
const addCategory = require('../add/category.js');
const addDate = require('../add/date.js');
const budget = require('../add/budget.js');
const fetchHelper = require('./fetch-helper.js');

async function addBudget(addNewBudgetBl, event, docClient) {
  if (!addNewBudgetBl) {
    return;
  }

  const events = [];
  events.push(budget.addNewBudget(event, docClient));

  /*
   * Only if there are items to be added
   */
  await Promise.all(events).then(
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
  docClient,
) {
  const addNewBudgetBl = await fetchHelper.checkIfBudgetAlreadyPresent(
    categoryName,
    checkIfBudgetIsPresent,
    today,
    event,
  );

  /*
   * Only if the new budget has to be created
   */
  const response = await addBudget(addNewBudgetBl, event, docClient);
  return response.budgetId;
}

AddHelper.prototype.createANewCategoryItem = (event, categoryId, categoryName, events) => {
  const createParam = event;
  createParam['body-json'].category = categoryId;
  createParam['body-json'].categoryName = categoryName;
  // If it is a newly created category then the category total is 0
  createParam['body-json'].used = 0;
  events.push(addCategory.createCategoryItem(event, categoryId, categoryName));
  // Do not check the budget for a newly created category
  return false;
};

AddHelper.prototype.createANewDate = (dateMeantFor, today, event) => {
  const events = [];
  const newDateId = `Date#${today.toISOString()}`;
  console.log('Date entry is empty so creating the date object');
  events.push(addDate.createDateData(event, newDateId));
  return dateMeantFor;
};

AddHelper.prototype.addBudgetIfNotAlreadyPresent = addBudgetIfNotAlreadyPresent;

// Export object
module.exports = new AddHelper();
