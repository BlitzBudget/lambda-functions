const helper = require('utils/helper');
const fetchHelper = require('utils/fetch-helper');
const deleteHelper = require('utils/delete-helper');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'eu-west-1'});
var sns = new AWS.SNS();

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();
// Concurrently call multiple APIs and wait for the response
let events = [];

exports.handler = async (event) => {
  console.log('event ' + JSON.stringify(event.Records[0]));
  let userId = event.Records[0].Sns.Message;

  let deleteParams = await fetchHelper.fetchAllItemsToDelete(
    userId,
    deleteParams,
    sns,
    DB,
    events
  );

  if (helper.isEmpty(deleteParams)) {
    return event;
  }

  // Publish to SNS and delete all financial portfolio entries
  await deleteHelper.deleteAllWallets(deleteParams, DB, events);

  return event;
};
