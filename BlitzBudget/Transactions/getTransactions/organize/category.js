const util = require('../utils/util');

module.exports.organize = (responseData, categoryList, fullMonth) => {
  let incomeTotal = 0;
  let expenseTotal = 0;
  let periodBalance = 0;

  responseData.Category.forEach((categoryObj) => {
    const category = categoryObj;
    if (util.isNotEmpty(categoryList[categoryObj.sk]) && !fullMonth) {
      category.category_total = categoryList[categoryObj.sk];
    }

    if (util.isEqual(categoryObj.category_type, 'Income')) {
      incomeTotal += categoryObj.category_total;
    } else if (util.isEqual(categoryObj.category_type, 'Expense')) {
      expenseTotal += categoryObj.category_total;
    }
    periodBalance = incomeTotal + expenseTotal;
    category.categoryId = categoryObj.sk;
    category.walletId = categoryObj.pk;
    delete category.sk;
    delete category.pk;
  });

  return { incomeTotal, expenseTotal, periodBalance };
};
