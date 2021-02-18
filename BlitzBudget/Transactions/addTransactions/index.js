// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

const helper = require('./utils/helper');
const fetchHelper = require('./utils/fetch-helper');
const addHelper = require('./utils/add-helper');

// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log('adding transactions for ', JSON.stringify(event['body-json']));
  const events = [];
  const { walletId } = event['body-json'];

  helper.throwErrorIfEmpty(event, walletId);

  await fetchHelper.calculateAndFetchDate(event, walletId, events, docClient);

  await fetchHelper.calculateAndFetchCategory(event, events, docClient);

  const transactionId = await addHelper.addAllItems(events, event, docClient);

  const response = event['body-json'];
  response.transactionId = transactionId;

  return event;
};
