const budget = require('../add/budget');

module.exports.addBudget = async (event, today, documentClient) => {
  let budgetId;
  await budget.addNewBudget(event, today, documentClient).then(
    (result) => {
      console.log('successfully saved the new Budget');
      budgetId = result.budgetId;
    },
    (err) => {
      throw new Error(`Unable to add the Budget ${err}`);
    },
  );

  return budgetId;
};
