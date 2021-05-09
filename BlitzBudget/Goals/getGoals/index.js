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
const dynamoDB = new AWS.DynamoDB();
const documentClient = dynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log('fetching item for the walletId ', event['body-json'].walletId);
  const events = [];
  const {
    userId,
    oneYearAgo,
    today,
  } = helper.extractVariablesFromRequest(event);

  // Cognito does not store wallet information nor curreny. All are stored in wallet.
  const walletResponse = await fetchHelper.fetchWalletInformation(
    event['body-json'].walletId,
    userId,
    documentClient,
  );

  const allResponses = await fetchHelper.fetchOtherRelevantInformation(
    events,
    walletResponse.walletPK,
    oneYearAgo,
    today,
    documentClient,
  );

  allResponses.Wallet = walletResponse.response.Wallet;

  return allResponses;
};
