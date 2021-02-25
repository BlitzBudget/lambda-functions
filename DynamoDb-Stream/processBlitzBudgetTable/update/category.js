const UpdateCategory = () => {};

const constants = require('../constants/constant');

function updateCategoryItem(pk, sk, difference, docClient) {
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
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        console.error(
          'Unable to update item. Error JSON:',
          JSON.stringify(err, null, 2),
        );
        reject(err);
      } else {
        console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2));
        resolve(data);
      }
    });
  });
}

UpdateCategory.prototype.updateCategoryItem = updateCategoryItem;
// Export object
module.exports = new UpdateCategory();
