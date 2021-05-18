function AddHelper() {}

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const util = require('./util');
const addDateHelper = require('./add-date-helper');
const addBudgetHelper = require('./add-budget-helper');
const addCategoryHelper = require('./add-category-helper');
const fetchHelper = require('./fetch-budget-helper');
const fetchDateHelper = require('./fetch-date-helper');
const fetchCategoryHelper = require('./fetch-category-helper');
const constants = require('../constants/constant');

// Set the region
AWS.config.update({
  region: constants.AWS_LAMBDA_REGION,
});

// Create the DynamoDB service object
const dynamoDB = new AWS.DynamoDB();
const documentClient = new dynamoDB.DocumentClient();

/*
 * Check if the budget is present for a newly created category
 * For Simultaneous cross device creation compatability
 */
async function addBudgetIfNotAlreadyPresent(
  hasNewCategoryBeenCreated,
  today,
  event,
  events,
) {
  if (!hasNewCategoryBeenCreated) {
    const budget = await fetchHelper.fetchBudget(
      today,
      event,
      documentClient,
    );

    if (util.isNotEmpty(budget.Budget)) {
      return budget.Budget.sk;
    }
  }

  /*
   * Only if the new budget has to be created
   */
  const budgetId = await addBudgetHelper.addBudget(event, today, documentClient);

  /*
  * Call Events
  */
  await Promise.all(events).then(
    () => {
      console.log('Successfully added the information');
    },
    (err) => {
      throw new Error(
        `Unable error occured while fetching the Wallet ${err}`,
      );
    },
  );
  return budgetId;
}

AddHelper.prototype.creatDateIfNecessary = async (dateMeantFor, walletId) => {
  let dateId = dateMeantFor;
  let events = [];

  if (util.notIncludesStr(dateMeantFor, 'Date#')) {
    console.log('The date is %j', dateMeantFor);
    const today = new Date(dateMeantFor);
    const dateResponse = await fetchDateHelper.fetchDateData(walletId, today, documentClient);

    if (util.isNotEmpty(dateResponse.Date) && util.isNotEmpty(dateResponse.Date[0])) {
      console.log('successfully assigned the exissting date %j', dateResponse.Date[0].sk);
      dateId = dateResponse.Date[0].sk;
    } else {
      const response = addDateHelper.createANewDate(
        today,
        walletId,
        documentClient,
      );
      dateId = response.dateId;
      events = response.events;
    }
  }
  return { dateId, events };
};

AddHelper.prototype.createCategoryIfNecessary = async (
  event,
  today,
  events,
) => {
  let hasNewCategoryBeenCreated = false;
  let categoryId = event['body-json'].category;
  const categoryName = event['body-json'].category;

  if (util.isNotEmpty(categoryName) && util.notIncludesStr(categoryName, 'Category#')) {
    const response = await fetchCategoryHelper.fetchCategoryItem(event, today, documentClient);

    if (util.isEmpty(response.Category)) {
      categoryId = `Category#${today.toISOString()}`;
      const createCategoryRequest = event;
      createCategoryRequest['body-json'].categoryId = categoryId;
      createCategoryRequest['body-json'].categoryName = categoryName;
      // If it is a newly created category then the category total is 0
      createCategoryRequest['body-json'].used = 0;

      addCategoryHelper.createANewCategoryItem(
        createCategoryRequest,
        events,
        documentClient,
      );

      hasNewCategoryBeenCreated = true;
    }
  }
  return { hasNewCategoryBeenCreated, categoryId };
};

AddHelper.prototype.addBudgetIfNotAlreadyPresent = addBudgetIfNotAlreadyPresent;

// Export object
module.exports = new AddHelper();
