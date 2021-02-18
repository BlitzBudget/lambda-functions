// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const helper = require('./utils/helper');
const updateHelper = require('./utils/update-helper');

// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const events = [];
  console.log('updating transactions for ', JSON.stringify(event['body-json']));

  /*
   * If category Id is not present
   */
  await helper.calculateAndFetchCategory(event, events, docClient);

  const response = await updateHelper.updateAllItems(events, event, docClient);

  const updateResponse = event['body-json'];
  // updateResponse.category = response.Category.Attributes.sk;
  updateResponse.category = response.Transaction.Attributes.category;
  updateResponse.amount = response.Transaction.Attributes.amount;

  return updateResponse;
};
