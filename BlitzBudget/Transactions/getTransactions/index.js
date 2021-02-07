const helper = require('utils/helper');
const fetchHelper = require('utils/fetch-helper');
const snsHelper = require('utils/sns-helper');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'eu-west-1'
});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({
    region: 'eu-west-1'
});
let transactionData = {};
let percentage = 1;

var sns = new AWS.SNS();
let snsEvents = [];

exports.handler = async (event) => {
    transactionData = {};
    percentage = 1;
    console.log("fetching item for the walletId ", event['body-json'].walletId);
    let events = [];
    let { startsWithDate, endsWithDate, walletId, userId } = helper.extractVariablesFromRequest(event);
    let fullMonth = helper.isFullMonth(startsWithDate, endsWithDate);

    // Cognito does not store wallet information nor curreny. All are stored in wallet.
    walletId = await fetchHelper.fetchWalletItem(walletId, userId, docClient);

    await fetchHelper.fetchAllRelevantItems(events, walletId, startsWithDate, endsWithDate, docClient, snsEvents, sns);

    helper.calculateDateAndCategoryTotal(fullMonth);

    await snsHelper.sendSNSToCreateNewTransactions(snsEvents);
    return transactionData;
};
