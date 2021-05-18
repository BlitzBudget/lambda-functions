// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const helper = require('./utils/helper');
const constants = require('./constants/constant');
const fetchHelper = require('./utils/fetch-helper');
const deleteHelper = require('./utils/delete-helper');

// Set the region
AWS.config.update({
  region: constants.AWS_LAMBDA_REGION,
});

// Create the DynamoDB service object
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log(`event ${JSON.stringify(event)}`);
  const { walletId, curentPeriod } = helper.extractVariablesFromRequest(event);

  // Get Transactions and Budget Items
  const response = await fetchHelper.fetchAllItemsToDelete(
    walletId,
    curentPeriod,
    documentClient,
  );

  await deleteHelper.bulkDeleteItems(
    response,
    walletId,
    event['body-json'].category,
    documentClient,
  );

  return event;
};
