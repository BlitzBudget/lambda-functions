function BankAccount() {}
const bankAccountParameter = require('../create-parameter/bank-account');
const organizeBankAccount = require('../organize/bank-account');

BankAccount.prototype.getBankAccountData = async (pk, documentClient) => {
  const params = bankAccountParameter.createParameter(pk);

  // Call DynamoDB to read the item from the table

  const response = await documentClient.query(params).promise();

  organizeBankAccount.organize(response);
  return {
    BankAccount: response.Items,
  };
};

// Export object
module.exports = new BankAccount();
