const Transaction = () => {};

const constants = require('../constants/constant');

// Get all Transaction Items
Transaction.prototype.getTransactionItems = async (walletId, DB) => {
  const params = {
    TableName: constants.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': walletId,
      ':items': 'Transaction#',
    },
    ProjectionExpression:
      'amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags',
  };

  // Call DynamoDB to read the item from the table
  const response = await DB.query(params).promise();
  return response;
};

// Export object
module.exports = new Transaction();
