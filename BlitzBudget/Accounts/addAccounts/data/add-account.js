function AddAccount() {}

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const constants = require('../constants/constant');
// Set the region
AWS.config.update({
  region: constants.EU_WEST_ONE,
});

// Create the DynamoDB service object
const dynamoDB = new AWS.DynamoDB();
const documentClient = dynamoDB.DocumentClient();

AddAccount.prototype.addNewBankAccounts = async (event) => {
  const today = new Date();
  const randomValue = `BankAccount#${today.toISOString()}`;

  const params = {
    TableName: constants.TABLE_NAME,
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

  const response = await documentClient.put(params).promise();
  return {
    success: response,
    accountId: randomValue,
  };
};

module.exports = new AddAccount();
