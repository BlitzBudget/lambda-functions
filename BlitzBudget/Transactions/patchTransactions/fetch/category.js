const FetchCategory = () => {};

const helper = require('../utils/helper');

function getCategoryData(event, today, docClient) {
  function organizeCategoryObject(data) {
    console.log('data retrieved - Category %j', data.Count);
    let obj;

    if (helper.isNotEmpty(data.Items)) {
      Object.keys(data.Items).forEach((categoryObj) => {
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
    return obj;
  }

  function createParameters() {
    return {
      TableName: 'blitzbudget',
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
  }

  const params = createParameters();

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        const obj = organizeCategoryObject(data);

        resolve({
          Category: obj,
        });
      }
    });
  });
}

FetchCategory.prototype.getCategoryData = getCategoryData;
// Export object
module.exports = new FetchCategory();
