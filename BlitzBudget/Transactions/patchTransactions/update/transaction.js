function UpdateTransaction() {}

const transactionExpression = require('../create-expression/transaction');

async function updatingTransactions(event, documentClient) {
  const params = transactionExpression.createExpression(event);

  console.log('Updating an item...');
  const response = await documentClient.update(params).promise();
  return {
    Transaction: response,
  };
}

UpdateTransaction.prototype.updatingTransactions = updatingTransactions;
// Export object
module.exports = new UpdateTransaction();
