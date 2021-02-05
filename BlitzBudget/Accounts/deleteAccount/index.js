const helper = require('utils/helper');

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
    let walletId = event['body-json'].walletId;
    let accountToDelete = event['body-json'].account;
    let result = {};
    let events = [];

    // Recurring Transactions and Transactions
    result = await helper.fetchAccountsTransactionsAndRecurringTrans(events, walletId, result, DB);

    events = await buildRequestAndDeleteAccount(result, walletId, accountToDelete, events, DB);

    return event;
};

async function buildRequestAndDeleteAccount(result, walletId, accountToDelete, events) {
    helper.logResultIfEmpty(result, walletId);

    let deleteRequests = helper.buildDeleteRequest(result, walletId, accountToDelete);

    // Push Events  to be executed in bulk
    events = await helper.deleteAccountsAndItsData(events, deleteRequests, DB);
    return events;
}
