const fetchHelper = require('utils/fetch-helper');
const helper = require('utils/helper');

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

let overviewData = {};

exports.handler = async (event) => {
    overviewData = {};
    let { oneYearAgo, walletId, userId, startsWithDate, endsWithDate } = helper.extractVariablesFromRequest(event);

    // Cognito does not store wallet information nor curreny. All are stored in wallet.
    walletId = await fetchHelper.fetchAllWallets(walletId, userId, overviewData, docClient);

    // To display Category name
    await fetchHelper.fetchAllItems(walletId, startsWithDate, endsWithDate, oneYearAgo, overviewData, docClient);

    return overviewData;
};
