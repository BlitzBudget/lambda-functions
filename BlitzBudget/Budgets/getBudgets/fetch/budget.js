const Budget = () => {};

const constants = require('../constants/constant');

// Get Budget Item
Budget.prototype.getBudgetsItem = (
  walletId,
  startsWithDate,
  endsWithDate,
  BudgetData,
  docClient,
) => {
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
};

// Export object
module.exports = new Budget();
