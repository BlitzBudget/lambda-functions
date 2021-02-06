const helper = require('utils/helper');
const fetchHelper = require('utils/fetch-helper');
const deleteHelper = require('utils/delete-helper');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log( 'event ' + JSON.stringify(event.Records[0]));
    let walletId = event.Records[0].Sns.Message;
    
    let result = await fetchHelper.fetchAllItemsForWallet(walletId, result, DB);
    
    if(helper.noItemsPresent(result)) {
        console.log("There are no items to delete for the wallet %j", walletId);
        return event;
    }
    
    await deleteHelper.bulkDeleteItems(result, walletId, DB);  
        
    return event;
};
