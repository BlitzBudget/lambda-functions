// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const fetchHelper = require('./utils/fetch-helper');
const helper = require('./utils/helper');
const constants = require('./constants/constant');

// Set the region
AWS.config.update({
  region: constants.AWS_LAMBDA_REGION,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const {
    oneYearAgo,
    userId,
    startsWithDate,
    endsWithDate,
  } = helper.extractVariablesFromRequest(event);

  // Cognito does not store wallet information nor curreny. All are stored in wallet.
  const { walletPK, response } = await fetchHelper.fetchAllWallets(
    event['body-json'].walletId,
    userId,
    documentClient,
  );

  // To display Category name
  const allResponses = await fetchHelper.fetchAllItems(
    walletPK,
    startsWithDate,
    endsWithDate,
    oneYearAgo,
    documentClient,
  );
  allResponses.Wallet = response.Wallet;

  return allResponses;
};
