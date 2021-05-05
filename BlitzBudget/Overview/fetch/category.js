function FetchCategory() {}

const categoryParameter = require('../create-parameter/category');
const organizeCategory = require('../organize/category');

async function getCategoryData(pk, startsWithDate, endsWithDate, documentClient) {
  const params = categoryParameter.createParameter(pk, startsWithDate, endsWithDate);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  organizeCategory.organize(response);
  return ({
    Category: response.Items,
  });
}

FetchCategory.prototype.getCategoryData = getCategoryData;
// Export object
module.exports = new FetchCategory();
