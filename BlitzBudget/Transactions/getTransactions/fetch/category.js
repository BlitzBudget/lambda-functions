const FetchCategory = () => {};

const constants = require('../constants/constant');

function getCategoryData(pk, startsWithDate, endsWithDate, docClient) {
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
        'pk, sk, FetchCategory_name, FetchCategory_total, FetchCategory_type',
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
        console.log('data retrieved - Category %j', data.Count);
        resolve({
          Category: data.Items,
        });
      }
    });
  });
}

FetchCategory.prototype.getCategoryData = getCategoryData;
// Export object
module.exports = new FetchCategory();
