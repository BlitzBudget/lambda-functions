const BankAccount = () => {};
const bankAccountParameter = require('../create-parameter/bank-account');

BankAccount.prototype.getBankAccountData = async (pk, documentClient) => {
  function organizeAccountData(data) {
    console.log('data retrieved - Bank Account %j', data.Count);
    if (data.Items) {
      data.Items.forEach((accountObj) => {
        const account = accountObj;
        account.accountId = accountObj.sk;
        account.walletId = accountObj.pk;
        delete account.sk;
        delete account.pk;
      });
    }
  }

  const params = bankAccountParameter.createParameters(pk);

  // Call DynamoDB to read the item from the table

  const response = await documentClient.query(params).promise();

  organizeAccountData(response);
  return {
    BankAccount: response.Items,
  };
};

// Export object
module.exports = new BankAccount();
