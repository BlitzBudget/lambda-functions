function UpdateHelper() {}

const fetchHelper = require('./fetch-helper');
const updateBudgets = require('../update/budget');
const createBudgetExpression = require('../create-expression/update-budget');

async function updateBudget(events, event, documentClient) {
  const params = createBudgetExpression.createExpression(event);
  events.push(updateBudgets.updatingBudgets(params, documentClient));

  await Promise.all(events).then(
    () => {
      console.log('successfully saved the existing Budgets');
    },
    (err) => {
      throw new Error(`Unable to add the Budgets ${err}`);
    },
  );
}

/*
 * Check if the budget is present for a newly created category
 * For Simultaneous cross device creation compatability
 */
async function updateBudgetIfNotPresent(
  event,
  events,
  documentClient,
) {
  await fetchHelper.fetchBudget(
    event,
    documentClient,
  );

  await updateBudget(events, event, documentClient);
}

UpdateHelper.prototype.updateBudgetIfNotPresent = updateBudgetIfNotPresent;

// Export object
module.exports = new UpdateHelper();
