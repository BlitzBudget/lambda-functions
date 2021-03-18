// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const fetchHelper = require('./utils/fetch-helper');
const helper = require('./utils/helper');
const constants = require('./constants/constant');

// Set the region
AWS.config.update({
  region: constants.EU_WEST_ONE,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: constants.EU_WEST_ONE,
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
    documentClient,
  );

  // To display Category name
  await fetchHelper.fetchAllItems(
    walletId,
    startsWithDate,
    endsWithDate,
    oneYearAgo,
    overviewData,
    documentClient,
    events,
  );

  return overviewData;
};
