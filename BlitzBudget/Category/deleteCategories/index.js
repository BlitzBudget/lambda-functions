// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const helper = require('./utils/helper');
const fetchHelper = require('./utils/fetch-helper');
const deleteHelper = require('./utils/delete-helper');

// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
const DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log(`event ${JSON.stringify(event)}`);
  const { walletId, curentPeriod } = helper.extractVariablesFromRequest(event);

  // Get Transactions and Budget Items
  const { result, events } = await fetchHelper.fetchAllItemsToDelete(
    walletId,
    curentPeriod,
    DB,
  );

  await deleteHelper.bulkDeleteItems(
    events,
    result,
    walletId,
    event,
    DB,
  );

  return event;
};
