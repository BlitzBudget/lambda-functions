const FetchBudget = () => {};

const constants = require('../constants/constant');

// Get Budget Item
function getBudgetsItem(walletId, startsWithDate, endsWithDate, docClient) {
  function createParameters() {
    return {
      TableName: constants.TABLE_NAME,
      KeyConditionExpression: 'pk = :walletId AND sk BETWEEN :bt1 AND :bt2',
      ExpressionAttributeValues: {
        ':walletId': walletId,
        ':bt1': `Budget#${startsWithDate}`,
        ':bt2': `Budget#${endsWithDate}`,
      },
      ProjectionExpression: 'category, planned, sk, pk',
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
        console.log('data retrieved ', data.Count);
        resolve({
          Budget: data.Items,
        });
      }
    });
  });
}

FetchBudget.prototype.getBudgetsItem = getBudgetsItem;
// Export object
module.exports = new FetchBudget();
