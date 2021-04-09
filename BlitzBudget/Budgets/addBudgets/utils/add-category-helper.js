const addCategory = require('../add/category');

module.exports.createANewCategoryItem = (event, events, documentClient) => {
  events.push(addCategory.createCategoryItem(event, documentClient));
};
