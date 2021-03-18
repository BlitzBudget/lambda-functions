const UpdateCategory = () => {};

const constants = require('../constants/constant');

async function updateCategoryItem(pk, sk, difference, documentClient) {
  const params = {
    TableName: constants.TABLE_NAME,
    Key: {
      pk,
      sk,
    },
    UpdateExpression: 'set category_total = category_total + :ab',
    ConditionExpression: 'attribute_exists(category_total)',
    ExpressionAttributeValues: {
      ':ab': difference,
    },
    ReturnValues: 'NONE',
  };

  console.log('Updating the item...');

  const response = await documentClient.update(params).promise();
  return response;
}

UpdateCategory.prototype.updateCategoryItem = updateCategoryItem;
// Export object
module.exports = new UpdateCategory();
