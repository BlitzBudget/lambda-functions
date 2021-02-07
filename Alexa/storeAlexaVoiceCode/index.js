const helper = require('utils/helper');
const cognitoHelper = require('utils/cognito-helper');
const configuration = require('utils/cognito-configuration');
const addHelper = require('utils/add-helper');
const deleteHelper = require('utils/delete-helper');
const fetchHelper = require('utils/fetch-helper');

const crypto = require('crypto');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({
    region: 'eu-west-1'
});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    let response = {};
    let { username, deleteVoiceCode } = helper.extractVariablesFromRequest(event);

    // Authorization code
    helper.throwErrorIfUsernameEmpty(username);

    // Save Alexa Voice Code
    helper.throwErrorIfVoicecodeEmpty(event, deleteVoiceCode);

    let signature = crypto.createHmac('SHA256', configuration.clientSecret)
        .update(username + configuration.clientId)
        .digest('base64')

    let params = helper.createParameter(username, event, signature);

    response = await cognitoHelper.loginUser(params, response, cognitoidentityserviceprovider);

    await cognitoHelper.fetchUserAttributes(response, cognitoidentityserviceprovider);

    /*
     * Fetch user id from cognito attributes
     */
    let userId = helper.fetchUserId(response);

    /*
     * User Id cannot be found
     */
    helper.throwErrorIfUserIdEmpty(userId);

    /*
     * Add a new voice code
     */
    let today = new Date();
    // Check if the voice code is present
    let voiceCodePresent = false;
    let alexaId = "AlexaVoiceCode#" + today.toISOString();

    ({ alexaId, voiceCodePresent } = await fetchHelper.handleGetNewVoiceCode(userId, alexaId, voiceCodePresent, docClient));

    if (deleteVoiceCode && voiceCodePresent) {
        await deleteHelper.handleDeleteOldVoiceCode(userId, alexaId, docClient);
    } else {
        await addHelper.handleAddNewVoiceCode(event, userId, alexaId, docClient);
    }

    return event;
};
