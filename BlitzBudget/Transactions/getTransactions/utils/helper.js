const Helper = () => {};

function isEmpty(obj) {
  // Check if objext is a number or a boolean
  if (typeof obj === 'number' || typeof obj === 'boolean') return false;

  // Check if obj is null or undefined
  if (obj === null || obj === undefined) return true;

  // Check if the length of the obj is defined
  if (typeof obj.length !== 'undefined') return obj.length === 0;

  // check if obj is a custom obj
  if (obj
&& Object.keys(obj).length !== 0) { return false; }

  return true;
}

function isNotEmpty(obj) {
  return !isEmpty(obj);
}

function isEqual(obj1, obj2) {
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
    return true;
  }
  return false;
}

function isNotEqual(obj1, obj2) {
  return !isEqual(obj1, obj2);
}

function extractVariablesFromRequest(event) {
  const { userId } = event['body-json'];
  const { startsWithDate } = event['body-json'];
  const { endsWithDate } = event['body-json'];
  return {
    startsWithDate, endsWithDate, userId,
  };
}

function calculateDateAndCategoryTotal(fullMonth, response, percentage) {
  const categoryList = {};
  const responseData = response;
  let incomeTotal = 0;
  let expenseTotal = 0;
  let periodBalance = 0;

  function organizeBudgetItems() {
    Object.keys(responseData.Budget).forEach((budgetObj) => {
      const budget = budgetObj;
      budget.planned *= percentage;
      if (isNotEmpty(categoryList[budgetObj.category])) {
        budget.used = categoryList[budgetObj.category];
      } else {
        budget.used = 0;
      }
      budget.budgetId = budgetObj.sk;
      budget.walletId = budgetObj.pk;
      delete budget.sk;
      delete budget.pk;
    });
  }

  function organizeDateItems() {
    Object.keys(responseData.Date).forEach((dateObj) => {
      const date = dateObj;
      date.dateId = dateObj.sk;
      date.walletId = dateObj.pk;
      delete date.sk;
      delete date.pk;
    });
  }

  function organizeCategoryItems() {
    Object.keys(responseData.Category).forEach((categoryObj) => {
      const category = categoryObj;
      if (isNotEmpty(categoryList[categoryObj.sk]) && !fullMonth) {
        category.category_total = categoryList[categoryObj.sk];
      }

      if (isEqual(categoryObj.category_type, 'Income')) {
        incomeTotal += categoryObj.category_total;
      } else if (isEqual(categoryObj.category_type, 'Expense')) {
        expenseTotal += categoryObj.category_total;
      }
      periodBalance = incomeTotal + expenseTotal;
      category.categoryId = categoryObj.sk;
      category.walletId = categoryObj.pk;
      delete category.sk;
      delete category.pk;
    });
  }

  function organizeTransactionItems() {
    Object.keys(responseData.Transaction).forEach((transObj) => {
      const transaction = transObj;
      if (isEmpty(categoryList[transObj.category])) {
        categoryList[transObj.category] = transObj.amount;
      } else {
        categoryList[transObj.category] += transObj.amount;
      }
      transaction.transactionId = transObj.sk;
      transaction.walletId = transObj.pk;
      delete transaction.sk;
      delete transaction.pk;
    });
  }

  organizeTransactionItems();

  organizeCategoryItems();

  organizeDateItems();

  /*
   * Assuming the category total will be equal to the transactions added
   */
  organizeBudgetItems();

  responseData.incomeTotal = incomeTotal;
  responseData.expenseTotal = expenseTotal;
  responseData.balance = periodBalance;
}

/*
 * Calculate difference between startdate and end date
 */
function isFullMonth(startDate, endDate) {
  const startsWithDate = new Date(startDate);
  const endsWithDate = new Date(endDate);
  const isNotAFullMonth = false;
  const isAFullMonth = true;
  let percentage = 1;

  if (
    isNotEqual(startsWithDate.getMonth(), endsWithDate.getMonth())
    || isNotEqual(startsWithDate.getFullYear(), endsWithDate.getFullYear())
  ) {
    console.log('The month and the year do not coincide');
    return { isNotAFullMonth, percentage };
  }

  const firstDay = new Date(
    startsWithDate.getFullYear(),
    startsWithDate.getMonth(),
  );
  const lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

  if (
    isEqual(firstDay.getDate(), startsWithDate.getDate())
    && isEqual(lastDay.getDate(), endsWithDate.getDate())
  ) {
    return { isAFullMonth, percentage };
  }

  // Calculate oercentage only if the start date and end date is the same month and year,
  // Else the percentage will be applied for all months
  percentage = (endsWithDate.getDate() - startsWithDate.getDate())
    / (lastDay.getDate() - firstDay.getDate());
  console.log('Percentage of budget total to be calculated is %j', percentage);
  return { isNotAFullMonth, percentage };
}

Helper.prototype.isNotEqual = isNotEqual;
Helper.prototype.isEqual = isEqual;
Helper.prototype.isNotEmpty = isNotEmpty;
Helper.prototype.isEmpty = isEmpty;
Helper.prototype.isFullMonth = isFullMonth;
Helper.prototype.calculateDateAndCategoryTotal = calculateDateAndCategoryTotal;
Helper.prototype.extractVariablesFromRequest = extractVariablesFromRequest;
// Export object
module.exports = new Helper();
