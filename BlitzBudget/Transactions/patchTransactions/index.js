const helper = require('utils/helper');
const updateHelper = require('utils/update-helper');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  let events = [];
  console.log('updating transactions for ', JSON.stringify(event['body-json']));

  /*
   * If category Id is not present
   */
  await helper.calculateAndFetchCategory(event, events, docClient);

  await updateHelper.updateAllItems(events, event, docClient);

  return event;
};
