function AddAccount() {}

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const addBankAccount = require('../create-parameter/add-bank-account');
// Set the region
AWS.config.update({
  region: process.env.AWS_LAMBDA_REGION,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

AddAccount.prototype.addNewBankAccounts = async (event) => {
  const today = new Date();
  const randomValue = `BankAccount#${today.toISOString()}`;

  const params = addBankAccount.createParameter(event, randomValue);

  console.log('Adding a new item...');

  await documentClient.put(params).promise();
  return randomValue;
};

module.exports = new AddAccount();
