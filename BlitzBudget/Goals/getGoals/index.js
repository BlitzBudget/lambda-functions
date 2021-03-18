// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const helper = require('./utils/helper');
const constants = require('./constants/constant');
const fetchHelper = require('./utils/fetch-helper');

// Set the region
AWS.config.update({
  region: constants.EU_WEST_ONE,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: constants.EU_WEST_ONE,
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
    documentClient,
  );

  const allResponses = await fetchHelper.fetchOtherRelevantInformation(
    events,
    walletId,
    oneYearAgo,
    today,
    documentClient,
  );

  return allResponses;
};
