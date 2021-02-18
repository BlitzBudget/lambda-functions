const FetchBankAccount = () => {};

function getBankAccountData(pk, docClient) {
  function organizeRetrievedItems(data) {
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

  function createParameters() {
    return {
      TableName: 'blitzbudget',
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':items': 'BankAccount#',
      },
      ProjectionExpression:
        'bank_account_name, linked, bank_account_number, account_balance, sk, pk, selected_account, number_of_times_selected, account_type',
    };
  }

  const params = createParameters();

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        organizeRetrievedItems(data);
        resolve({
          BankAccount: data.Items,
        });
      }
    });
  });
}

FetchBankAccount.prototype.getBankAccountData = getBankAccountData;
// Export object
module.exports = new FetchBankAccount();
