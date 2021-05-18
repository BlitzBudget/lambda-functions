function AddHelper() {}

const createRecurringTransaction = require('../add/recurring-transaction');
const createTransaction = require('../add/transaction');
const util = require('./util');
const helper = require('./helper');
const fetchHelper = require('./fetch-helper');
const addCategory = require('../add/category');
const addDate = require('../add/date');

function addNewRecurringTransaction(event, events, documentClient) {
  if (
    util.isNotEmpty(event['body-json'].recurrence)
    && event['body-json'].recurrence !== 'NEVER'
  ) {
    events.push(
      createRecurringTransaction.addRecurringTransaction(event, documentClient),
    );
  }
}

async function addAllItems(events, event, documentClient) {
  let transactionId;
  let nextRecurrence;
  let categoryId;
  let dateId;
  addNewRecurringTransaction(event, events, documentClient);

  events.push(createTransaction.addNewTransaction(event, documentClient));

  await Promise.all(events).then(
    (response) => {
      response.forEach((aResponse) => {
        if (util.isNotEmpty(aResponse.transactionId)) {
          transactionId = aResponse.transactionId;
        } else if (util.isNotEmpty(aResponse.nextRecurrence)) {
          nextRecurrence = aResponse.nextRecurrence;
        } else if (util.isNotEmpty(aResponse.Category)) {
          categoryId = aResponse.Category.sk;
        } else if (util.isNotEmpty(aResponse.Date)) {
          dateId = aResponse.Date.sk;
        }
      });
      console.log('successfully saved the new transaction');
    },
    (err) => {
      throw new Error(`Unable to add the transactions ${err}`);
    },
  );

  return {
    transactionId, nextRecurrence, categoryId, dateId,
  };
}

async function addANewCategoryIfNotPresent(
  event,
  events,
  documentClient,
) {
  const createCategoryRequest = event;
  createCategoryRequest['body-json'].categoryName = event['body-json'].category;

  if (util.isNotEmpty(createCategoryRequest['body-json'].categoryName) && util.notIncludesStr(createCategoryRequest['body-json'].categoryName, 'Category#')) {
    const today = helper.formulateDateFromRequest(event);
    let categoryId = await fetchHelper.fetchCategory(event, today, documentClient);

    if (util.isEmpty(categoryId)) {
      categoryId = `Category#${today.toISOString()}`;
      createCategoryRequest['body-json'].category = categoryId;
      createCategoryRequest['body-json'].used = 0;
      events.push(
        addCategory.createCategoryItem(
          createCategoryRequest,
          documentClient,
        ),
      );
    }
  }
  return events;
}

async function addANewDateIfNotPresent(
  event,
  events,
  documentClient,
) {
  const createDateRequest = event;

  if (util.isNotEmpty(createDateRequest['body-json'].dateMeantFor) && util.notIncludesStr(createDateRequest['body-json'].dateMeantFor, 'Date#')) {
    const today = helper.formateDateWithoutID(event);
    let dateMeantFor = await fetchHelper.fetchDate(event, today, documentClient);

    if (util.isEmpty(dateMeantFor)) {
      dateMeantFor = `Date#${today.toISOString()}`;
      console.log('Date entry is empty so creating the date object');
      events.push(addDate.createDateData(event, dateMeantFor, documentClient));
    }
  }
  return events;
}

AddHelper.prototype.addANewDateIfNotPresent = addANewDateIfNotPresent;
AddHelper.prototype.addANewCategoryIfNotPresent = addANewCategoryIfNotPresent;
AddHelper.prototype.addAllItems = addAllItems;
// Export object
module.exports = new AddHelper();
