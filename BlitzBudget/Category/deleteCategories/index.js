const helper = require('utils/helper');
const fetchHelper = require('utils/fetch-helper');
const deleteHelper = require('utils/delete-helper');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({
    region: 'eu-west-1'
});

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('event ' + JSON.stringify(event));
    let { walletId, curentPeriod } = helper.extractVariablesFromRequest(event);

    // Get Transactions and Budget Items
    let result = await fetchHelper.fetchAllItemsToDelete(events, walletId, curentPeriod, result, DB);

    let events = await deleteHelper.bulkDeleteItems(events, result, walletId, event, DB);

    return event;
};
