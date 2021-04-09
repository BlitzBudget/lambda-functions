function AddCategory() {}

const categoryParameter = require('../create-parameter/add-category');

AddCategory.prototype.createCategoryItem = async (
  event,
  documentClient,
) => {
  const parameter = categoryParameter.createParameter(event);

  console.log('Adding a new item...');

  const response = await documentClient.update(parameter).promise();
  return {
    Category: response.Attributes,
  };
};

module.exports = new AddCategory();
