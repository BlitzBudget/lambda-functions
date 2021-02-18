// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const fetchHelper = require('./utils/fetch-helper');
const helper = require('./utils/helper');

// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-1',
});

let overviewData = {};

exports.handler = async (event) => {
  overviewData = {};
  const {
    oneYearAgo,
    userId,
    startsWithDate,
    endsWithDate,
  } = helper.extractVariablesFromRequest(event);

  // Cognito does not store wallet information nor curreny. All are stored in wallet.
  const { walletId, events } = await fetchHelper.fetchAllWallets(
    event['body-json'].walletId,
    userId,
    overviewData,
    docClient,
  );

  // To display Category name
  await fetchHelper.fetchAllItems(
    walletId,
    startsWithDate,
    endsWithDate,
    oneYearAgo,
    overviewData,
    docClient,
    events,
  );

  return overviewData;
};
