function FetchCategory() {}

const util = require('../utils/util');
const categoryParameter = require('../create-parameter/category');

async function getCategoryData(documentClient, event, today) {
  const params = categoryParameter.createParameter(event, today);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  let obj;
  if (util.isNotEmpty(response.Items)) {
    response.Items.forEach((categoryObj) => {
      if (util.isEqual(
        categoryObj.category_type,
        event['body-json'].categoryType,
      )
      && util.isEqual(categoryObj.category_name, event['body-json'].category)
      ) {
        console.log(
          'Found a match for the mentioned category %j',
          categoryObj.sk,
        );
        obj = categoryObj;
      }
    });
  }

  if (util.isEmpty(obj)) {
    console.log('No matching categories found');
  }

  return ({
    Category: obj,
  });
}

FetchCategory.prototype.getCategoryData = getCategoryData;
// Export object
module.exports = new FetchCategory();
