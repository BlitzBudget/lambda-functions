function AddHelper() {}

const util = require('./util');
const helper = require('./helper');
const fetchHelper = require('./fetch-helper');
const addCategory = require('../add/category');

async function addANewCategoryIfNotPresent(
  event,
  documentClient,
) {
  const createCategoryRequest = event;
  createCategoryRequest['body-json'].categoryName = event['body-json'].category;
  const events = [];

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
  return { createCategoryRequest, events };
}

AddHelper.prototype.addANewCategoryIfNotPresent = addANewCategoryIfNotPresent;
// Export object
module.exports = new AddHelper();
