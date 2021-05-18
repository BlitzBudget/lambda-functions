// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const util = require('./utils/util');
const fetchHelper = require('./utils/fetch-helper');
const deleteHelper = require('./utils/delete-helper');

// Set the region
AWS.config.update({ region: process.env.AWS_LAMBDA_REGION });
const sns = new AWS.SNS();

// Create the DynamoDB service object
const dynamoDB = new AWS.DynamoDB();
const documentClient = new dynamoDB.DocumentClient();
// Concurrently call multiple APIs and wait for the response
const events = [];

exports.handler = async (event) => {
  console.log(`event ${JSON.stringify(event.Records[0])}`);
  const userId = event.Records[0].Sns.Message;

  const deleteParams = await fetchHelper.fetchAllItemsToDelete(
    userId,
    sns,
    documentClient,
    events,
  );

  if (util.isEmpty(deleteParams)) {
    return event;
  }

  // Publish to SNS and delete all financial portfolio entries
  await deleteHelper.deleteAllWallets(deleteParams, documentClient, events);

  return event;
};
