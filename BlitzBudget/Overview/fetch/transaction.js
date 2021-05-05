function FetchTransaction() {}

const transactionParameter = require('../create-parameter/transaction');

// Get Transaction Item
async function getTransactionsData(pk, startsWithDate, endsWithDate, documentClient) {
  const params = transactionParameter.createParameter(pk, startsWithDate, endsWithDate);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  return {
    Transaction: response.Items,
  };
}

FetchTransaction.prototype.getTransactionsData = getTransactionsData;
// Export object
module.exports = new FetchTransaction();
