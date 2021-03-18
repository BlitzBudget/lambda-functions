const FetchTransaction = () => {};

const transactionParameter = require('../create-parameter/transaction');

// Get Transaction Item
async function getTransactionItems(pk, startsWithDate, endsWithDate, documentClient) {
  const params = transactionParameter.createParameters(pk, startsWithDate, endsWithDate);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  return {
    Transaction: response.Items,
  };
}

FetchTransaction.prototype.getTransactionItems = getTransactionItems;
// Export object
module.exports = new FetchTransaction();
