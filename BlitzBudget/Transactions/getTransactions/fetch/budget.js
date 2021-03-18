const FetchBudget = () => {};

const constants = require('../constants/constant');

// Get Budget Item
async function getBudgetsItem(walletId, startsWithDate, endsWithDate, documentClient) {
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
  const response = await documentClient.query(params).promise();

  return {
    Budget: response.Items,
  };
}

FetchBudget.prototype.getBudgetsItem = getBudgetsItem;
// Export object
module.exports = new FetchBudget();
