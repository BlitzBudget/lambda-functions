const TransactionFunction = () => {};

const constants = require('../constants/constant');

// Get Transaction Item
TransactionFunction.prototype.getTransactionsData = async (
  pk,
  startsWithDate,
  endsWithDate,
  docClient,
) => {
  function createParameters() {
    return {
      TableName: constants.TABLE_NAME,
      KeyConditionExpression: 'pk = :pk and sk BETWEEN :bt1 AND :bt2',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':bt1': `Transaction#${startsWithDate}`,
        ':bt2': `Transaction#${endsWithDate}`,
      },
      ProjectionExpression: 'amount, description, category, recurrence, sk, pk',
    };
  }

  const params = createParameters();

  // Call DynamoDB to read the item from the table
  const response = await docClient.query(params).promise();

  return {
    Transaction: response.Items,
  };
};

// Export object
module.exports = new TransactionFunction();
