const AddHelper = () => {};

const addCategory = require('../add/category');

function createANewCategory(
  event,
  categoryId,
  categoryName,
  events,
  docClient,
) {
  const createCategoryParam = event['body-json'];
  createCategoryParam.category = categoryId;
  createCategoryParam.categoryName = categoryName;
  // If it is a newly created category then the category total is 0
  createCategoryParam.used = 0;
  events.push(
    addCategory.createCategoryItem(createCategoryParam, categoryId, categoryName, docClient),
  );
}

AddHelper.prototype.createANewCategory = createANewCategory;
// Export object
module.exports = new AddHelper();
