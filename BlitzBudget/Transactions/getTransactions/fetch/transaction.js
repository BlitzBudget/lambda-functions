const FetchTransaction = () => {};

const transactionParameter = require('../create-parameter/transaction');

// Get Transaction Item
async function getTransactionItem(pk, startsWithDate, endsWithDate, documentClient) {
  const params = transactionParameter.createParameter(pk, startsWithDate, endsWithDate);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  return {
    Transaction: response.Items,
  };
}

FetchTransaction.prototype.getTransactionItem = getTransactionItem;
// Export object
module.exports = new FetchTransaction();
