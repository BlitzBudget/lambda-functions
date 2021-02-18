// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient();

const AddAccount = () => {};

AddAccount.prototype.addNewBankAccounts = (event) => {
  const today = new Date();
  const randomValue = `BankAccount#${today.toISOString()}`;

  const params = {
    TableName: 'blitzbudget',
    Item: {
      pk: event['body-json'].walletId,
      sk: randomValue,
      account_type: event['body-json'].accountType,
      bank_account_name: event['body-json'].bankAccountName,
      linked: event['body-json'].linked,
      account_balance: event['body-json'].accountBalance,
      account_sub_type: event['body-json'].accountSubType,
      selected_account: event['body-json'].selectedAccount,
      primary_wallet: event['body-json'].primaryWallet,
      creation_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    },
  };

  console.log('Adding a new item...');
  return new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        resolve({
          success: data,
          accountId: randomValue,
        });
      }
    });
  });
};

module.exports = new AddAccount();
