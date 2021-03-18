const FetchCategory = () => {};

const helper = require('../utils/helper');
const categoryParameter = require('../create-parameter/category');

async function getCategoryData(documentClient, event, today) {
  const params = categoryParameter.createParameter(event, today);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  let obj;
  if (helper.isNotEmpty(response.Items)) {
    response.Items.forEach((categoryObj) => {
      if (
        helper.isEqual(
          categoryObj.category_type,
          event['body-json'].categoryType,
        )
              && helper.isEqual(categoryObj.category_name, event['body-json'].category)
      ) {
        console.log(
          'Found a match for the mentioned category %j',
          categoryObj.sk,
        );
        obj = categoryObj;
      }
    });
  }

  if (helper.isEmpty(obj)) {
    console.log('No matching categories found');
  }

  return ({
    Category: obj,
  });
}

FetchCategory.prototype.getCategoryData = getCategoryData;
// Export object
module.exports = new FetchCategory();
