// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const helper = require('./utils/helper');
const constants = require('./constants/constant');
const updateHelper = require('./utils/update-helper');

// Set the region
AWS.config.update({
  region: constants.EU_WEST_ONE,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const events = [];
  console.log('updating transactions for ', JSON.stringify(event['body-json']));

  /*
   * If category Id is not present
   */
  await helper.calculateAndFetchCategory(event, events, documentClient);

  const response = await updateHelper.updateAllItems(events, event, documentClient);

  const updateResponse = event['body-json'];
  // updateResponse.category = response.Category.Attributes.sk;
  updateResponse.category = response.Transaction.Attributes.category;
  updateResponse.amount = response.Transaction.Attributes.amount;

  return updateResponse;
};
