const Budget = () => {};

const constants = require('../constants/constant');

// Get Budget Item
Budget.prototype.getBudgetData = async (
  walletId,
  startsWithDate,
  endsWithDate,
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
  const response = await docClient.query(params).promise();

  return {
    Budget: response.Items,
  };
};

// Export object
module.exports = new Budget();
