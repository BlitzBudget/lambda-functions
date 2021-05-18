// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const helper = require('./utils/util');
const constants = require('./constants/constant');
const fetchHelper = require('./utils/fetch-helper');
const deleteHelper = require('./utils/delete-helper');

// Set the region
AWS.config.update({ region: constants.AWS_LAMBDA_REGION });

// Create the DynamoDB service object
const dynamoDB = new AWS.DynamoDB();
const documentClient = new dynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log(`event ${JSON.stringify(event.Records[0])}`);
  const walletId = event.Records[0].Sns.Message;

  const result = await fetchHelper.fetchAllItemsForWallet(walletId, documentClient);

  if (helper.noItemsPresent(result)) {
    console.log('There are no items to delete for the wallet %j', walletId);
    return event;
  }

  await deleteHelper.bulkDeleteItems(result, walletId, documentClient);

  return event;
};
