const helper = require('utils/helper');
const fetchHelper = require('utils/fetch-helper');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-1',
});
let goalData = {};

exports.handler = async (event) => {
  console.log('fetching item for the walletId ', event['body-json'].walletId);
  goalData = {};
  let events = [];
  let {
    walletId,
    userId,
    oneYearAgo,
    today,
  } = helper.extractVariablesFromRequest(event);

  // Cognito does not store wallet information nor curreny. All are stored in wallet.
  walletId = await fetchHelper.fetchWalletInformation(
    walletId,
    userId,
    events,
    docClient,
    goalData
  );

  await fetchHelper.fetchOtherRelevantInformation(
    events,
    walletId,
    oneYearAgo,
    today,
    docClient,
    goalData
  );

  return goalData;
};
