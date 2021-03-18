const FetchBankAccount = () => {};

const bankAccountParameter = require('../create-parameter/bank-account');

FetchBankAccount.prototype.getBankAccountData = async function getBankAccountData(
  pk,
  documentClient,
) {
  function organizeRetrivedItems(data) {
    console.log('data retrieved - Bank Account %j', data.Count);
    if (data.Items) {
      Object.keys(data.Items).forEach((accountObj) => {
        const account = accountObj;
        account.accountId = accountObj.sk;
        account.walletId = accountObj.pk;
        delete account.sk;
        delete account.pk;
      });
    }
  }

  const params = bankAccountParameter.createParameters();

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  organizeRetrivedItems(response);
  return {
    BankAccount: response.Items,
  };
};

// Export object
module.exports = new FetchBankAccount();
