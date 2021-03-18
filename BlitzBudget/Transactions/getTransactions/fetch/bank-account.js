const FetchBankAccount = () => {};

const constants = require('../constants/constant');

async function getBankAccountData(pk, documentClient) {
  function organizeAccountItems(data) {
    console.log('data retrieved - Bank Account %j', data.Count);
    Object.keys(data.Items).forEach((accountObj) => {
      const account = accountObj;
      account.accountId = accountObj.sk;
      account.walletId = accountObj.pk;
      delete account.sk;
      delete account.pk;
    });
  }

  function createParameters() {
    return {
      TableName: constants.TABLE_NAME,
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':items': 'BankAccount#',
      },
      ProjectionExpression:
        'bank_account_name, linked, bank_account_number, account_balance, sk, pk, selected_account, number_of_times_selected, account_type,  account_sub_type',
    };
  }

  const params = createParameters();

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  organizeAccountItems(response);
  return {
    BankAccount: response.Items,
  };
}

FetchBankAccount.prototype.getBankAccountData = getBankAccountData;
// Export object
module.exports = new FetchBankAccount();
