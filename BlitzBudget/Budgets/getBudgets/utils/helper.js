var helper = function () {};

function isEmpty(obj) {
  // Check if objext is a number or a boolean
  if (typeof obj == 'number' || typeof obj == 'boolean') return false;

  // Check if obj is null or undefined
  if (obj == null || obj === undefined) return true;

  // Check if the length of the obj is defined
  if (typeof obj.length != 'undefined') return obj.length == 0;

  // check if obj is a custom obj
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }

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
helper.prototype.isFullMonth = (startsWithDate, endsWithDate) => {
  startsWithDate = new Date(startsWithDate);
  endsWithDate = new Date(endsWithDate);

  if (
    isNotEqual(startsWithDate.getMonth(), endsWithDate.getMonth()) ||
    isNotEqual(startsWithDate.getFullYear(), endsWithDate.getFullYear())
  ) {
    console.log('The month and the year do not coincide');
    return false;
  }

  let firstDay = new Date(
    startsWithDate.getFullYear(),
    startsWithDate.getMonth()
  );
  let lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

  if (
    isEqual(firstDay.getDate(), startsWithDate.getDate()) &&
    isEqual(lastDay.getDate(), endsWithDate.getDate())
  ) {
    return true;
  }

  // Calculate oercentage only if the start date and end date is the same month and year, Else the percentage will be applied for all months
  percentage =
    (endsWithDate.getDate() - startsWithDate.getDate()) /
    (lastDay.getDate() - firstDay.getDate());
  console.log('Percentage of budget total to be calculated is %j', percentage);
  return false;
};

helper.prototype.modifyTotalOfBudget = (percentage, fullMonth) => {
  let categoryList = {};
  let categoryNameList = {};

  if (!fullMonth) {
    for (const transObj of budgetData.Transaction) {
      if (isEmpty(categoryList[transObj.category])) {
        categoryList[transObj.category] = transObj.amount;
      } else {
        categoryList[transObj.category] += transObj.amount;
      }
    }
  }

  for (const categoryObj of budgetData.Category) {
    if (isEmpty(categoryNameList[categoryObj.sk])) {
      categoryNameList[categoryObj.sk] = categoryObj['category_name'];
    } else {
      categoryNameList[categoryObj.sk] += categoryObj['category_name'];
    }

    if (fullMonth) {
      if (isEmpty(categoryList[categoryObj.sk])) {
        categoryList[categoryObj.sk] = categoryObj['category_total'];
      } else {
        categoryList[categoryObj.sk] += categoryObj['category_total'];
      }
    }
  }

  for (const budgetObj of budgetData.Budget) {
    budgetObj.planned = budgetObj.planned * percentage;
    if (isNotEmpty(categoryList[budgetObj.category])) {
      budgetObj.used = categoryList[budgetObj.category];
    } else {
      budgetObj.used = 0;
    }

    if (isNotEmpty(categoryNameList[budgetObj.category])) {
      budgetObj.categoryName = categoryNameList[budgetObj.category];
    }

    budgetObj.budgetId = budgetObj.sk;
    budgetObj.walletId = budgetObj.pk;
    delete budgetObj.sk;
    delete budgetObj.pk;
  }

  for (const dateObj of budgetData.Date) {
    dateObj.dateId = dateObj.sk;
    dateObj.walletId = dateObj.pk;
    delete dateObj.sk;
    delete dateObj.pk;
  }

  delete budgetData.Transaction;
};

helper.prototype.extractVariablesFromRequest = (event) => {
  let walletId = event['body-json'].walletId;
  let startsWithDate = event['body-json'].startsWithDate;
  let endsWithDate = event['body-json'].endsWithDate;
  let userId = event['body-json'].userId;
  console.log(
    'fetching item for the walletId ',
    walletId,
    ' with the start date ',
    startsWithDate,
    ' and end date ',
    endsWithDate
  );
  return {startsWithDate, endsWithDate, walletId, userId};
};

helper.prototype.isEmpty = isEmpty;
helper.prototype.isNotEmpty = isNotEmpty;

// Export object
module.exports = new helper();
