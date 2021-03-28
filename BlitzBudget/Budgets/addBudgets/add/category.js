function AddCategory() {}

const categoryParameter = require('../create-parameter/add-category');

AddCategory.prototype.createCategoryItem = async (
  event,
  categoryId,
  categoryName,
  documentClient,
) => {
  const parameter = categoryParameter.createParameter(event, categoryId, categoryName);

  console.log('Adding a new item...');

  const response = await documentClient.update(parameter).promise();
  return {
    Category: response.Attributes,
  };
};

module.exports = new AddCategory();
