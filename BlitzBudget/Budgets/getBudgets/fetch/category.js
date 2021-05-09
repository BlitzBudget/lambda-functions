function Category() {}

const categoryParameter = require('../create-parameter/category');
const organizeCategory = require('../organize/category');

Category.prototype.getCategoryData = async (pk, startsWithDate, endsWithDate, documentClient) => {
  const params = categoryParameter.createParameter(pk, startsWithDate, endsWithDate);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  organizeCategory.organize(response);
  return {
    Category: response.Items,
  };
};

// Export object
module.exports = new Category();
