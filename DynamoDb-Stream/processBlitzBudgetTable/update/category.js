const UpdateCategory = () => {};

const categoryParameter = require('../create-parameter/category');

async function updateCategoryItem(pk, sk, difference, documentClient) {
  const params = categoryParameter.createParameter(pk, sk, difference);

  console.log('Updating the item...');

  const response = await documentClient.update(params).promise();
  return response;
}

UpdateCategory.prototype.updateCategoryItem = updateCategoryItem;
// Export object
module.exports = new UpdateCategory();
