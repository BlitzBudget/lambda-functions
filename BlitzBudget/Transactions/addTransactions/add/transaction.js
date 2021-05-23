function AddTransaction() {}

const transactionParameter = require('../create-parameter/transaction');
const helper = require('../utils/helper');

async function addNewTransaction(event, documentClient) {
  const today = helper.formulateDateFromRequest(event);
  const randomValue = `Transaction#${today.toISOString()}`;
  const params = transactionParameter.createParameter(event, randomValue, today);

  console.log('Adding a new item...');

  const response = await documentClient.put(params).promise();
  return {
    success: response,
    transactionId: randomValue,
  };
}

AddTransaction.prototype.addNewTransaction = addNewTransaction;
// Export object
module.exports = new AddTransaction();
