// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const fetchHelper = require('./utils/fetch-helper');
const constants = require('./constants/constant');
const updateHelper = require('./utils/update-helper');

// Set the region
AWS.config.update({
  region: constants.EU_WEST_ONE,
});

// Create the DynamoDB service object
const dynamoDB = new AWS.DynamoDB();
const documentClient = dynamoDB.DocumentClient();

exports.handler = async (event) => {
  const events = [];
  console.log('updating transactions for ', JSON.stringify(event['body-json']));

  /*
   * If category Id is not present
   */
  await fetchHelper.calculateAndFetchCategory(event, events, documentClient);

  const response = await updateHelper.updateAllItems(events, event, documentClient);

  const updateResponse = event;
  // updateResponse.category = response.Category.Attributes.sk;
  updateResponse['body-json'].category = response.Transaction.Attributes.category;
  updateResponse['body-json'].amount = response.Transaction.Attributes.amount;

  return updateResponse;
};
