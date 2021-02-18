// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const crypto = require('crypto');

const helper = require('./utils/helper');
const cognitoHelper = require('./utils/cognito-helper');
const configuration = require('./utils/cognito-configuration');
const addHelper = require('./utils/add-helper');
const deleteHelper = require('./utils/delete-helper');
const fetchHelper = require('./utils/fetch-helper');

// Set the region
AWS.config.update({
  region: 'eu-west-1',
});

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient();
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  const { username, deleteVoiceCode } = helper.extractVariablesFromRequest(
    event,
  );

  // Authorization code
  helper.throwErrorIfUsernameEmpty(username);

  // Save Alexa Voice Code
  helper.throwErrorIfVoicecodeEmpty(event, deleteVoiceCode);

  const signature = crypto
    .createHmac('SHA256', configuration.clientSecret)
    .update(username + configuration.clientId)
    .digest('base64');

  const params = helper.createParameter(username, event, signature);

  const loginResponse = await cognitoHelper.loginUser(
    params,
    cognitoidentityserviceprovider,
  );

  await cognitoHelper.fetchUserAttributes(
    loginResponse,
    cognitoidentityserviceprovider,
  );

  /*
   * Fetch user id from cognito attributes
   */
  const userId = helper.fetchUserId(loginResponse);

  /*
   * User Id cannot be found
   */
  helper.throwErrorIfUserIdEmpty(userId);

  /*
   * Add a new voice code
   */
  const today = new Date();
  // Check if the voice code is present
  let voiceCodePresent = false;
  const response = event['body-json'];
  let alexaVoiceCodeId;
  let alexaId = `AlexaVoiceCode#${today.toISOString()}`;

  ({ alexaId, voiceCodePresent } = await fetchHelper.handleGetNewVoiceCode(
    userId,
    docClient,
  ));

  if (deleteVoiceCode && voiceCodePresent) {
    await deleteHelper.handleDeleteOldVoiceCode(userId, alexaId, docClient);
  } else {
    alexaVoiceCodeId = await addHelper.handleAddNewVoiceCode(event, userId, alexaId, docClient);
    response.alexaVoiceCodeId = alexaVoiceCodeId;
  }

  return response;
};
