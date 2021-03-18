const UpdateTransaction = () => {};

const transactionParameter = require('../create-parameter/transaction');

async function updatingTransactions(event, documentClient) {
  const params = transactionParameter.createParameters(event);

  console.log('Updating an item...');
  const response = await documentClient.update(params).promise();
  return {
    Transaction: response,
  };
}

UpdateTransaction.prototype.updatingTransactions = updatingTransactions;
// Export object
module.exports = new UpdateTransaction();
