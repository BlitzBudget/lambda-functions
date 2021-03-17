const FetchBudget = () => {};

const constants = require('../constants/constant');

// Get all budget Items
FetchBudget.prototype.getBudgetItems = async (walletId, currentPeriod, DB) => {
  const params = {
    TableName: constants.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': walletId,
      ':items': `Budget#${currentPeriod}`,
    },
    ProjectionExpression: 'category, planned, sk, pk',
  };

  // Call DynamoDB to read the item from the table

  const response = await DB.query(params).promise();
  return response;
};

// Export object
module.exports = new FetchBudget();
