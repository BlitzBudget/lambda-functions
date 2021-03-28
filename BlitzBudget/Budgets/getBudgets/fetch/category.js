const Category = () => {};

const categoryParameter = require('../create-parameter/category');

Category.prototype.getCategoryData = async (pk, startsWithDate, endsWithDate, documentClient) => {
  function organizeCategoryData(data) {
    console.log('data retrieved - Category %j', data.Count);
    if (data.Items) {
      data.Items.forEach((categoryObj) => {
        const category = categoryObj;
        category.categoryId = categoryObj.sk;
        category.walletId = categoryObj.pk;
        delete category.sk;
        delete category.pk;
      });
    }
  }

  const params = categoryParameter.createParameters(pk, startsWithDate, endsWithDate);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  organizeCategoryData(response);
  return {
    Category: response.Items,
  };
};

// Export object
module.exports = new Category();
