// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

const helper = require('./utils/helper');
const fetchHelper = require('./utils/fetch-helper');
const constants = require('./constants/constant');

// Set the region
AWS.config.update({
  region: constants.EU_WEST_ONE,
});

// Create the DynamoDB service object
const dynamoDB = new AWS.DynamoDB();
const documentClient = dynamoDB.DocumentClient();

exports.handler = async (event) => {
  const {
    startsWithDate,
    endsWithDate,
    userId,
  } = helper.extractVariablesFromRequest(event);
  const { fullMonth, percentage } = helper.isFullMonth(startsWithDate, endsWithDate);

  // Cognito does not store wallet information nor curreny. All are stored in wallet.
  const {
    walletId,
    response,
  } = await fetchHelper.fetchWalletsIfEmpty(
    event['body-json'].walletId,
    userId,
    documentClient,
  );

  const otherResponse = await fetchHelper.fetchAllInformationForBudget(
    walletId,
    startsWithDate,
    endsWithDate,
    fullMonth,
    documentClient,
  );

  const budgetResponse = otherResponse;
  budgetResponse.Wallet = response;

  helper.modifyTotalOfBudget(percentage, fullMonth, budgetResponse);

  return budgetResponse;
};
