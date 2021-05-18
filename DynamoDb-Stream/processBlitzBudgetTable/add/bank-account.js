function BankAccount() {}

const addBankAccountParameter = require('../create-parameter/add-bank-account');

async function addNewBankAccount(record, documentClient) {
  const today = new Date();
  const randomValue = `BankAccount#${today.toISOString()}`;
  const params = addBankAccountParameter.createParameter(record, randomValue);

  console.log('Adding a new item...');

  const response = await documentClient.put(params).promise();
  return response;
}

BankAccount.prototype.addNewBankAccount = addNewBankAccount;
// Export object
module.exports = new BankAccount();
