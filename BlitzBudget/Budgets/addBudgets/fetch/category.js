const FetchCategory = () => {};

const helper = require('../utils/helper');
const categoryParameter = require('../create-parameter/category');

FetchCategory.prototype.getCategoryData = (event, today, documentClient) => {
  const params = categoryParameter.createParameter(event, today);

  // Call DynamoDB to read the item from the table
  const response = documentClient.query(params).promise();

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
