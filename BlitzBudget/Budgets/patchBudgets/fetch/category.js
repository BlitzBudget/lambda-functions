function FetchCategory() {}

const helper = require('../utils/helper');
const categoryParameter = require('../create-parameter/category');

FetchCategory.prototype.getCategoryData = async (event, today, documentClient) => {
  const params = categoryParameter.createParameter(event, today);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  const categories = helper.calculateCategory(response, event);

  return { Category: categories };
};

// Export object
module.exports = new FetchCategory();
