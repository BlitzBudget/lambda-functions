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

/*
 * Calculate difference between startdate and end date
 */
Helper.prototype.isFullMonth = (startDate, endDate) => {
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
};

Helper.prototype.modifyTotalOfBudget = (percentage, fullMonth, budgetData) => {
  const categoryList = {};
  const categoryNameList = {};
  const responseData = budgetData;

  if (!fullMonth) {
    Object.keys(responseData.Transaction).forEach((transObj) => {
      if (isEmpty(categoryList[transObj.category])) {
        categoryList[transObj.category] = transObj.amount;
      } else {
        categoryList[transObj.category] += transObj.amount;
      }
    });
  }

  Object.keys(responseData.Category).forEach((categoryObj) => {
    if (isEmpty(categoryNameList[categoryObj.sk])) {
      categoryNameList[categoryObj.sk] = categoryObj.category_name;
    } else {
      categoryNameList[categoryObj.sk] += categoryObj.category_name;
    }

    if (fullMonth) {
      if (isEmpty(categoryList[categoryObj.sk])) {
        categoryList[categoryObj.sk] = categoryObj.category_total;
      } else {
        categoryList[categoryObj.sk] += categoryObj.category_total;
      }
    }
  });

  Object.keys(responseData.Budget).forEach((budgetObj) => {
    const budget = budgetObj;
    budget.planned *= percentage;
    if (isNotEmpty(categoryList[budgetObj.category])) {
      budget.used = categoryList[budgetObj.category];
    } else {
      budget.used = 0;
    }

    if (isNotEmpty(categoryNameList[budgetObj.category])) {
      budget.categoryName = categoryNameList[budgetObj.category];
    }

    budget.budgetId = budgetObj.sk;
    budget.walletId = budgetObj.pk;
    delete budget.sk;
    delete budget.pk;
  });

  Object.keys(responseData.Date).forEach((dateObj) => {
    const date = dateObj;
    date.dateId = dateObj.sk;
    date.walletId = dateObj.pk;
    delete date.sk;
    delete date.pk;
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

Helper.prototype.isEmpty = isEmpty;
Helper.prototype.isNotEmpty = isNotEmpty;

// Export object
module.exports = new Helper();
