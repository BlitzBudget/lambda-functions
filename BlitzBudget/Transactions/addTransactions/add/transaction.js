function AddTransaction() {}

const transactionParameter = require('../create-parameter/transaction');

async function addNewTransaction(event, documentClient) {
  const today = new Date();
  today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
  today.setMonth(
    parseInt(event['body-json'].dateMeantFor.substring(10, 12), 10) - 1,
  );
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
