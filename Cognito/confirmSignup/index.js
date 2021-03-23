const AWS = require('aws-sdk');

const walletHelper = require('./utils/wallet-helper');
const loginHelper = require('./utils/login-helper');
const confirmSignupHelper = require('./utils/confirm-signup-helper');
const fetchUserHelper = require('./utils/fetch-user-helper');
const constants = require('./constants/constant');

AWS.config.update({ region: constants.EU_WEST_ONE });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

// Create the DynamoDB service object
const DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const doNotCreateANewWallet = event['body-json'].doNotCreateWallet;
  const countryLocale = event.params.header['CloudFront-Viewer-Country'];

  await confirmSignupHelper.confirmSignup(event, cognitoidentityserviceprovider);

  const response = await loginHelper.login(event, cognitoidentityserviceprovider);

  await fetchUserHelper.fetchUserInformation(response, cognitoidentityserviceprovider);

  await walletHelper.addNewWallet(
    response,
    doNotCreateANewWallet,
    countryLocale,
    DB,
  );

  return response;
};
