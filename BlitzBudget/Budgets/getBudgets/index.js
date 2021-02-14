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

let budgetData = {};
let percentage = 1;

exports.handler = async (event) => {
  percentage = 1;
  budgetData = {};
  let events = [];
  let {
    startsWithDate,
    endsWithDate,
    walletId,
    userId,
  } = helper.extractVariablesFromRequest(event);
  let fullMonth = helper.isFullMonth(startsWithDate, endsWithDate);

  // Cognito does not store wallet information nor curreny. All are stored in wallet.
  walletId = await fetchHelper.fetchWalletsIfEmpty(
    walletId,
    userId,
    budgetData,
    docClient
  );

  await fetchHelper.fetchAllInformationForBudget(
    events,
    walletId,
    startsWithDate,
    endsWithDate,
    fullMonth,
    budgetData,
    docClient
  );

  helper.modifyTotalOfBudget(percentage, fullMonth);

  return budgetData;
};
