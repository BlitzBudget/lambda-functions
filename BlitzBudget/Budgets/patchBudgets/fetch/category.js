const FetchCategory = () => {};

const helper = require('../utils/helper');
const categoryParameter = require('../create-parameter/category');

FetchCategory.prototype.getCategoryData = async (event, today, documentClient) => {
  function calculateCategory(data) {
    console.log('data retrieved - Category %j', data.Count);
    let obj;
    if (helper.isNotEmpty(data.Items)) {
      Object.keys(data.Items).forEach((categoryObj) => {
        if (helper.isEqual(categoryObj.category_type, event['body-json'].categoryType)
          && helper.isEqual(categoryObj.category_name, event['body-json'].category)) {
          console.log('Found a match for the mentioned category %j', categoryObj.sk);
          obj = categoryObj;
        }
      });
    }

    if (helper.isEmpty(obj)) {
      console.log('No matching categories found');
    }
    return obj;
  }

  const params = categoryParameter.createParameters(event, today);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  const categories = calculateCategory(response);

  return { Category: categories };
};

// Export object
module.exports = new FetchCategory();
