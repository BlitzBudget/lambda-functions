var addHelper = function () {};

const addCategory = require('../add/category');

function addCategoryItem(event, categoryId, categoryName, events, docClient) {
  event['body-json'].category = categoryId;
  event['body-json'].categoryName = categoryName;
  // If it is a newly created category then the category total is 0
  event['body-json'].used = 0;
  events.push(
    addCategory.createCategoryItem(event, categoryId, categoryName, docClient)
  );
}

addHelper.prototype.addCategoryItem = addCategoryItem;
// Export object
module.exports = new addHelper();
