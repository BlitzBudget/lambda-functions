const helper = require('utils/helper');
const deleteHelper = require('utils/delete-helper');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log( 'event %j' + JSON.stringify(event['body-json']));
    let { result, walletId } = helper.extractVariablesFromRequest(event);
    let events = [];
    
    if(helper.noItemsInRequest(result)) {
        console.log("There are no items to delete for the wallet %j", walletId);
        return event;
    }
    
    await deleteHelper.deleteAllItemsInBulk(result, walletId, events, DB);  
        
    return event;
};
