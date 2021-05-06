const AddCategory = () => {};

const addCategoryParameter = require('../create-parameter/add-category');

async function createCategoryItem(event, skForCategory, categoryName, documentClient) {
  const params = addCategoryParameter.createParameter(event, skForCategory, categoryName);

  console.log('Adding a new item...');
  const response = await documentClient.update(params).promise();

  return {
    Category: response.Attributes,
  };
}

AddCategory.prototype.createCategoryItem = createCategoryItem;
// Export object
module.exports = new AddCategory();
