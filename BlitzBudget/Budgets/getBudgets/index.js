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
  const events = [];
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
    docClient,
  );

  const otherResponse = await fetchHelper.fetchAllInformationForBudget(
    events,
    walletId,
    startsWithDate,
    endsWithDate,
    fullMonth,
    docClient,
  );

  const budgetResponse = otherResponse;
  budgetResponse.Wallet = response;

  helper.modifyTotalOfBudget(percentage, fullMonth, budgetResponse);

  return budgetResponse;
};
