const fetchBudget = require('../fetch/budget.js');

module.exports.fetchBudget = async (
  today,
  event,
  documentClient,
) => {
  let response;
  await fetchBudget.getBudgetsItem(today, event, documentClient).then(
    (result) => {
      response = result;
    },
    (err) => {
      throw new Error(
        `Unable to get the budget item to check if the budget is present ${
          err}`,
      );
    },
  );

  return response;
};
