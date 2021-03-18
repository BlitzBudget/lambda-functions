const FetchCategory = () => {};

const constants = require('../constants/constant');

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

  function createParameters() {
    return {
      TableName: constants.TABLE_NAME,
      KeyConditionExpression: 'pk = :pk and sk BETWEEN :bt1 AND :bt2',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':bt1': `Category#${startsWithDate}`,
        ':bt2': `Category#${endsWithDate}`,
      },
      ProjectionExpression:
        'pk, sk, category_name, category_total, category_type',
    };
  }

  const params = createParameters();

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
