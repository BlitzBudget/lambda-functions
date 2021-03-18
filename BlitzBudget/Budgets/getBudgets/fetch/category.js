const Category = () => {};

const constants = require('../constants/constant');

Category.prototype.getCategoryData = async (pk, startsWithDate, endsWithDate, docClient) => {
  function organizeCategoryData(data) {
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
  const response = await docClient.query(params).promise();

  organizeCategoryData(response);
  return {
    Category: response.Items,
  };
};

// Export object
module.exports = new Category();
