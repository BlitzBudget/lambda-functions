// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

const helper = require('./utils/helper');
const fetchHelper = require('./utils/fetch-helper');

// Set the region
AWS.config.update({
  region: process.env.AWS_LAMBDA_REGION,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const {
    startsWithDate,
    endsWithDate,
    userId,
  } = helper.extractVariablesFromRequest(event);
  const { fullMonth, percentage } = helper.isFullMonth(startsWithDate, endsWithDate);

  // Cognito does not store wallet information nor curreny. All are stored in wallet.
  const {
    walletPK,
    response,
  } = await fetchHelper.fetchWalletsIfEmpty(
    event['body-json'].walletId,
    userId,
    documentClient,
  );

  const otherResponse = await fetchHelper.fetchAllInformationForBudget(
    walletPK,
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
