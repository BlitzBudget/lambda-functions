function Helper() { }

const util = require('./util');

/*
 * Calculate difference between startdate and end date
 */
Helper.prototype.isFullMonth = (startDate, endDate) => {
  const startsWithDate = new Date(startDate);
  const endsWithDate = new Date(endDate);
  let isAFullMonth = true;
  let percentage = 1;
  const firstDayOfTheMonth = startsWithDate.getDate();

  if (
    util.isNotEqual(startsWithDate.getMonth(), endsWithDate.getMonth())
    || util.isNotEqual(startsWithDate.getFullYear(), endsWithDate.getFullYear()
      || util.isEqual(firstDayOfTheMonth, 1)
      || util.isLastDayOfTheMonth(endsWithDate))
  ) {
    console.log('The month and the year do not coincide');
    isAFullMonth = false;
    return { isAFullMonth, percentage };
  }

  const firstDay = new Date(
    startsWithDate.getFullYear(),
    startsWithDate.getMonth(),
  );
  const lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

  if (
    util.isEqual(firstDay.getDate(), startsWithDate.getDate())
    && util.isEqual(lastDay.getDate(), endsWithDate.getDate())
  ) {
    return { isAFullMonth, percentage };
  }

  // Calculate oercentage only if the start date and end date is the same month and year,
  // Else the percentage will be applied for all months
  percentage = (endsWithDate.getDate() - startsWithDate.getDate())
    / (lastDay.getDate() - firstDay.getDate());
  console.log('Percentage of budget total to be calculated is %j', percentage);
  isAFullMonth = false;
  return { isAFullMonth, percentage };
};

Helper.prototype.modifyTotalOfBudget = (percentage, fullMonth, budgetData) => {
  const categoryList = {};
  const categoryNameList = {};
  const responseData = budgetData;

  if (!fullMonth) {
    responseData.Transaction.forEach((transObj) => {
      if (util.isEmpty(categoryList[transObj.category])) {
        categoryList[transObj.category] = transObj.amount;
      } else {
        categoryList[transObj.category] += transObj.amount;
      }
    });
  }

  responseData.Category.forEach((categoryObj) => {
    if (util.isEmpty(categoryNameList[categoryObj.sk])) {
      categoryNameList[categoryObj.sk] = categoryObj.category_name;
    } else {
      categoryNameList[categoryObj.sk] += categoryObj.category_name;
    }

    if (fullMonth) {
      if (util.isEmpty(categoryList[categoryObj.sk])) {
        categoryList[categoryObj.sk] = categoryObj.category_total;
      } else {
        categoryList[categoryObj.sk] += categoryObj.category_total;
      }
    }
  });

  responseData.Budget.forEach((budgetObj) => {
    const budget = budgetObj;
    budget.planned *= percentage;
    if (util.isNotEmpty(categoryList[budgetObj.category])) {
      budget.used = categoryList[budgetObj.category];
    } else {
      budget.used = 0;
    }

    if (util.isNotEmpty(categoryNameList[budgetObj.category])) {
      budget.categoryName = categoryNameList[budgetObj.category];
    }

    budget.budgetId = budgetObj.sk;
    budget.walletId = budgetObj.pk;
    delete budget.sk;
    delete budget.pk;
  });

  delete responseData.Transaction;
};

Helper.prototype.extractVariablesFromRequest = (event) => {
  const { startsWithDate } = event['body-json'];
  const { endsWithDate } = event['body-json'];
  const { userId } = event['body-json'];
  console.log(
    ' Fetching the start date ',
    startsWithDate,
    ' and end date ',
    endsWithDate,
  );
  return {
    startsWithDate, endsWithDate, userId,
  };
};

// Export object
module.exports = new Helper();
