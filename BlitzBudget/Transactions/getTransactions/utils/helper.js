function Helper() {}

const util = require('./util');
const organizeBudget = require('../organize/budget');
const organizeDate = require('../organize/date');
const organizeCategory = require('../organize/category');
const organizeTransaction = require('../organize/transaction');

function extractVariablesFromRequest(event) {
  const { userId } = event['body-json'];
  const { startsWithDate } = event['body-json'];
  const { endsWithDate } = event['body-json'];
  return {
    startsWithDate, endsWithDate, userId,
  };
}

function calculateDateAndCategoryTotal(fullMonth, response, percentage) {
  const responseData = response;

  const categoryList = organizeTransaction.organize(responseData);

  const totals = organizeCategory.organize(responseData, categoryList, fullMonth);

  organizeDate.organize(responseData);

  /*
   * Assuming the category total will be equal to the transactions added
   */
  organizeBudget.organize(responseData, percentage, categoryList);

  responseData.incomeTotal = totals.incomeTotal;
  responseData.expenseTotal = totals.expenseTotal;
  responseData.balance = totals.periodBalance;

  return responseData;
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

  if (util.isNotEqual(startsWithDate.getMonth(), endsWithDate.getMonth())
    || util.isNotEqual(startsWithDate.getFullYear(), endsWithDate.getFullYear())
  ) {
    console.log('The month and the year do not coincide');
    return { isNotAFullMonth, percentage };
  }

  const firstDay = new Date(
    startsWithDate.getFullYear(),
    startsWithDate.getMonth(),
  );
  const lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

  if (util.isEqual(firstDay.getDate(), startsWithDate.getDate())
    && util.isEqual(lastDay.getDate(), endsWithDate.getDate())
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

Helper.prototype.isFullMonth = isFullMonth;
Helper.prototype.calculateDateAndCategoryTotal = calculateDateAndCategoryTotal;
Helper.prototype.extractVariablesFromRequest = extractVariablesFromRequest;
// Export object
module.exports = new Helper();
