const FetchCategory = () => {};

const categoryParameter = require('../create-parameter/category');

async function getCategoryData(pk, startsWithDate, endsWithDate, documentClient) {
  function organizeRetrievedItems(data) {
    console.log('data retrieved - Category %j', data.Count);
    if (data.Items) {
      Object.keys(data.Items).forEach((categoryObj) => {
        const category = categoryObj;
        category.categoryId = categoryObj.sk;
        category.walletId = categoryObj.pk;
        delete category.sk;
        delete category.pk;
      });
    }
  }

  const params = categoryParameter.createParameter(pk, startsWithDate, endsWithDate);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  organizeRetrievedItems(response);
  return ({
    Category: response.Items,
  });
}

FetchCategory.prototype.getCategoryData = getCategoryData;
// Export object
module.exports = new FetchCategory();
