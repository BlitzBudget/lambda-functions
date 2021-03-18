const FetchCategory = () => {};

const helper = require('../utils/helper');
const constants = require('../constants/constant');

FetchCategory.prototype.getCategoryData = (event, today, docClient) => {
  const params = {
    TableName: constants.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': event['body-json'].walletId,
      ':items':
        `Category#${
          today.getFullYear()
        }-${
          (`0${today.getMonth() + 1}`).slice(-2)}`,
    },
    ProjectionExpression: 'pk, sk, category_name, category_type',
  };

  // Call DynamoDB to read the item from the table
  const response = docClient.query(params).promise();

  let categories;
  if (helper.isNotEmpty(response.Items)) {
    response.Items.forEach((category) => {
      if (helper.isEqual(category.category_type, event['body-json'].categoryType)
        && helper.isEqual(category.category_name, event['body-json'].category)) {
        console.log('Found a match for the mentioned category %j', category.sk);
        categories = category;
      }
    });
  }

  if (helper.isEmpty(categories)) {
    console.log('No matching categories found');
  }

  return {
    Category: categories,
  };
};

// Export object
module.exports = new FetchCategory();
