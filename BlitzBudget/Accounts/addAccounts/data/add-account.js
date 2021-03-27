function AddAccount() {}

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const constants = require('../constants/constant');
const addBankAccount = require('../create-parameter/add-bank-account');
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

  const params = addBankAccount.createParameter(event, randomValue);

  console.log('Adding a new item...');

  await documentClient.put(params).promise();
  return randomValue;
};

module.exports = new AddAccount();
