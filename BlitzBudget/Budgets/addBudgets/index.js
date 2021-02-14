const helper = require('utils/helper');
const fetchHelper = require('utils/fetch-helper');
const addHelper = require('utils/add-helper');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();
let percentage = 1;

exports.handler = async (event) => {
  console.log('adding Budget for ', JSON.stringify(event['body-json']));

  percentage = 1;
  let today;
  let categoryName;
  let checkIfBudgetIsPresent = true;
  let {
    walletId,
    dateMeantFor,
    startsWithDate,
    endsWithDate,
  } = helper.extractVariablesFromRequest(event);

  helper.throwErrorIfEmpty(event, walletId);

  dateMeantFor = await fetchHelper.calculateAndFetchDate(
    dateMeantFor,
    startsWithDate,
    endsWithDate,
    event,
    walletId,
    events
  );

  ({
    today,
    categoryName,
    checkIfBudgetIsPresent,
  } = await fetchHelper.calculateAndFetchCategory(
    event,
    categoryName,
    checkIfBudgetIsPresent,
    events
  ));

  await addHelper.addBudgetIfNotAlreadyPresent(
    categoryName,
    checkIfBudgetIsPresent,
    today,
    event
  );

  return event;
};
