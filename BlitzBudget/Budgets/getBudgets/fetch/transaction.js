function TransactionFunction() {}

const transactionParameter = require('../create-parameter/transaction');

// Get Transaction Item
TransactionFunction.prototype.getTransactionsData = async (
  pk,
  startsWithDate,
  endsWithDate,
  documentClient,
) => {
  const params = transactionParameter.createParameter(pk, startsWithDate, endsWithDate);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  return {
    Transaction: response.Items,
  };
};

// Export object
module.exports = new TransactionFunction();
