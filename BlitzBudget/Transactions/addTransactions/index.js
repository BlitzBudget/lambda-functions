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

    throwErrorIfEmpty(event, walletId);

    await calculateAndFetchDate(event, walletId, events);

    await calculateAndFetchCategory(event, events);

    await addAllItems(events, event);

    return event;
};

