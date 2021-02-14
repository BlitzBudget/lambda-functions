var category = function () {};

function updateCategoryItem(pk, sk, difference) {
  let params = {
    TableName: 'blitzbudget',
    Key: {
      pk: pk,
      sk: sk,
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
    docClient.update(params, function (err, data) {
      if (err) {
        console.error(
          'Unable to update item. Error JSON:',
          JSON.stringify(err, null, 2)
        );
        reject(err);
      } else {
        console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2));
        resolve(data);
      }
    });
  });
}

category.prototype.updateCategoryItem = updateCategoryItem;
// Export object
module.exports = new category();
