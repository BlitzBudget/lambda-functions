// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-1',
});
const FetchAccounts = () => {};

function getBankAccountItem(params) {
  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('data retrieved ', JSON.stringify(data.Items));
        resolve(data);
      }
    });
  });
}

// Get BankAccount Item
FetchAccounts.prototype.getBankAccountItem = getBankAccountItem;

// Export object
module.exports = new FetchAccounts();
