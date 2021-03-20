const FetchHelper = () => {};
const helper = require('./helper');
const addHelper = require('./add-helper');
const fetchDate = require('../fetch/date.js');
const fetchBudget = require('../fetch/budget.js');
const fetchCategory = require('../fetch/category.js');

async function fetchCategoryIdIfNotProvided(
  event,
  today,
  events,
) {
  let isBudgetPresent = true;
  const categoryName = event['body-json'].category;
  if (
    util.isNotEmpty(categoryName)
    && util.notIncludesStr(categoryName, 'Category#')
  ) {
    const categoryId = `Category#${today.toISOString()}`;

    /*
     * Check if category is present before adding them
     */
    await fetchCategory.getCategoryData(categoryId, event, today).then(
      (result) => {
        if (util.isNotEmpty(result.Category)) {
          console.log(
            'successfully assigned the existing category %j',
            result.Category.sk,
          );
        } else {
          isBudgetPresent = addHelper.createANewCategoryItem(
            event,
            categoryId,
            categoryName,
            events,
          );
        }
      },
      (err) => {
        throw new Error(`Unable to get the category ${err}`);
      },
    );
  }
  return { categoryName, isBudgetPresent };
}

async function fetchDateIdIfNotProvided(dateMeantFor, event, walletId) {
  let dateId = dateMeantFor;
  if (util.notIncludesStr(dateMeantFor, 'Date#')) {
    console.log('The date is %j', dateMeantFor);
    const today = new Date(event['body-json'].dateMeantFor);

    /*
     * Check if date is present before adding them
     */
    await fetchDate.getDateData(walletId, today).then(
      (result) => {
        if (util.isNotEmpty(result.Date)) {
          console.log(
            'successfully assigned the exissting date %j',
            result.Date[0].sk,
          );
          dateId = result.Date[0].sk;
        } else {
          dateId = addHelper.createANewDate(
            dateMeantFor,
            today,
            event,
          );
        }
      },
      (err) => {
        throw new Error(`Unable to add the Budget ${err}`);
      },
    );
  }
  return dateId;
}

async function checkIfBudgetAlreadyPresent(
  categoryName,
  checkIfBudgetIsPresent,
  today,
  event,
) {
  let addNewBudgetBl = true;
  if (util.isNotEmpty(categoryName) && checkIfBudgetIsPresent) {
    // Check if the budget is present for the mentioned category
    await fetchBudget.getBudgetsItem(today, event).then(
      (result) => {
        if (util.isNotEmpty(result.Budget)) {
          addNewBudgetBl = false;
        }
      },
      (err) => {
        throw new Error(
          `Unable to get the budget item to check if the budget is present ${
            err}`,
        );
      },
    );
  }
  return addNewBudgetBl;
}

/**
 * Convert DateMeantFor to Date
 */
async function calculateAndFetchCategory(
  today,
  event,
  events,
) {
  /*
   * If category Id is not present
   */
  const { categoryName, isBudgetPresent } = await fetchCategoryIdIfNotProvided(
    event,
    today,
    events,
  );
  return { categoryName, isBudgetPresent };
}

/*
 * Start date and end date is present without datemeantfor
 */
async function calculateAndFetchDate(
  dateMeantFor,
  event,
  walletId,
) {
  /*
   * If Date Id is not present
   */
  const dateId = await fetchDateIdIfNotProvided(dateMeantFor, event, walletId);
  return dateId;
}

FetchHelper.prototype.calculateAndFetchDate = calculateAndFetchDate;
FetchHelper.prototype.calculateAndFetchCategory = calculateAndFetchCategory;
FetchHelper.prototype.checkIfBudgetAlreadyPresent = checkIfBudgetAlreadyPresent;

// Export object
module.exports = new FetchHelper();
