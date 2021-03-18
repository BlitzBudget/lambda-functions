const BankAccount = () => {};

async function addNewBankAccount(record, documentClient) {
  const today = new Date();
  const randomValue = `BankAccount#${today.toISOString()}`;

  function createParameters() {
    return {
      TableName: 'blitzbudget',
      Item: {
        pk: record.dynamodb.Keys.sk.S,
        sk: randomValue,
        account_type: 'ASSET',
        account__sub_type: 'Cash',
        bank_account_name: 'Cash',
        linked: false,
        account_balance: 0,
        selected_account: true,
        primary_wallet: record.dynamodb.Keys.pk.S,
        creation_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
    };
  }

  const params = createParameters();

  console.log('Adding a new item...');

  const response = await documentClient.put(params).promise();
  return response;
}

BankAccount.prototype.addNewBankAccount = addNewBankAccount;
// Export object
module.exports = new BankAccount();
