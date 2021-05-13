function FetchCategory() {}

const categoryParameter = require('../create-parameter/category');
const filterCategory = require('../filter/category');

async function getCategoryData(event, today, documentClient) {
  const params = categoryParameter.createParameter(event, today);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  return ({
    Category: filterCategory.filter(response, event),
  });
}

FetchCategory.prototype.getCategoryData = getCategoryData;
// Export object
module.exports = new FetchCategory();
