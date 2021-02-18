const AddHelper = () => {};

const addCategory = require('../add/category');

function addCategoryItem(event, categoryId, categoryName, events, docClient) {
  const createCategoryParam = event['body-json'];
  createCategoryParam.category = categoryId;
  createCategoryParam.categoryName = categoryName;
  // If it is a newly created category then the category total is 0
  createCategoryParam.used = 0;
  events.push(
    addCategory.createCategoryItem(createCategoryParam, categoryId, categoryName, docClient),
  );
}

AddHelper.prototype.addCategoryItem = addCategoryItem;
// Export object
module.exports = new AddHelper();
