function AddHelper() {}

const util = require('./util');
const helper = require('./helper');
const fetchHelper = require('./fetch-helper');
const addCategory = require('../add/category');

async function addANewCategoryIfNotPresent(
  event,
  documentClient,
) {
  const createCategory = event['body-json'];
  createCategory.categoryName = event['body-json'].category;
  const events = [];

  if (util.isNotEmpty(createCategory.categoryName) && util.notIncludesStr(createCategory.categoryName, 'Category#')) {
    const today = helper.formulateDateFromRequest(event);
    let categoryId = await fetchHelper.fetchCategory(event, today, documentClient);

    if (util.isEmpty(categoryId)) {
      categoryId = `Category#${today.toISOString()}`;
      createCategory.category = categoryId;
      createCategory.used = 0;
      events.push(
        addCategory.createCategoryItem(
          createCategory,
          documentClient,
        ),
      );
    }
  }
  return { createCategory, events };
}

AddHelper.prototype.addANewCategoryIfNotPresent = addANewCategoryIfNotPresent;
// Export object
module.exports = new AddHelper();
