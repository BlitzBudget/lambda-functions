const helper = require('utils/helper');
const fetchHelper = require('utils/fetch-helper');
const addHelper = require('utils/add-helper');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'eu-west-1'
});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("adding transactions for ", JSON.stringify(event['body-json']));
    let events = [];
    let walletId = event['body-json'].walletId;

    helper.throwErrorIfEmpty(event, walletId);

    await fetchHelper.calculateAndFetchDate(event, walletId, events, docClient);

    await fetchHelper.calculateAndFetchCategory(event, events, docClient);

    await addHelper.addAllItems(events, event, docClient);

    return event;
};

