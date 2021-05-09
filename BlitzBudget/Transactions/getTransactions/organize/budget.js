const util = require('../utils/util');

module.exports.organize = (responseData, percentage, categoryList) => {
  responseData.Budget.forEach((budgetObj) => {
    const budget = budgetObj;
    budget.planned *= percentage;
    if (util.isNotEmpty(categoryList[budgetObj.category])) {
      budget.used = categoryList[budgetObj.category];
    } else {
      budget.used = 0;
    }
    budget.budgetId = budgetObj.sk;
    budget.walletId = budgetObj.pk;
    delete budget.sk;
    delete budget.pk;
  });
};
