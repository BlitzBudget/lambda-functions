// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const helper = require('./utils/helper');
const fetchHelper = require('./utils/fetch-helper');

// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-1',
});

exports.handler = async (event) => {
  console.log('fetching item for the walletId ', event['body-json'].walletId);
  const events = [];
  const {
    userId,
    oneYearAgo,
    today,
  } = helper.extractVariablesFromRequest(event);

  // Cognito does not store wallet information nor curreny. All are stored in wallet.
  const walletId = await fetchHelper.fetchWalletInformation(
    event['body-json'].walletId,
    userId,
    events,
    docClient,
  );

  const allResponses = await fetchHelper.fetchOtherRelevantInformation(
    events,
    walletId,
    oneYearAgo,
    today,
    docClient,
  );

  return allResponses;
};
