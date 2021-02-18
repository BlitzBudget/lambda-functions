// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const helper = require('./utils/helper');
const fetchHelper = require('./utils/fetch-helper');
const deleteHelper = require('./utils/delete-helper');

// Set the region
AWS.config.update({ region: 'eu-west-1' });
const sns = new AWS.SNS();

// Create the DynamoDB service object
const DB = new AWS.DynamoDB.DocumentClient();
// Concurrently call multiple APIs and wait for the response
const events = [];

exports.handler = async (event) => {
  console.log(`event ${JSON.stringify(event.Records[0])}`);
  const userId = event.Records[0].Sns.Message;

  const deleteParams = await fetchHelper.fetchAllItemsToDelete(
    userId,
    sns,
    DB,
    events,
  );

  if (helper.isEmpty(deleteParams)) {
    return event;
  }

  // Publish to SNS and delete all financial portfolio entries
  await deleteHelper.deleteAllWallets(deleteParams, DB, events);

  return event;
};
