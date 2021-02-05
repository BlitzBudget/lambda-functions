const helper = require('utils/helper');
const localeToCurrency = require('utils/locale-to-currency');
const wallet = require('wallet/add-new-wallet');
const login = require('user/login');
const fetchUser = require('user/fetch-user');
const confirmSignup = require('user/confirm-signup');

const AWS = require('aws-sdk')
AWS.config.update({ region: 'eu-west-1' });
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  let response = {};
  let doNotCreateANewWallet = event['body-json'].doNotCreateWallet;
  let countryLocale = event.params.header['CloudFront-Viewer-Country'];

  await handleConfirmSignup(event);

  response = await handleLogin(event, response);

  await handleFetchUserInformation(response);

  await handleAddANewWallet(response, currenyChosen, doNotCreateANewWallet, countryLocale);

  return response;
};

async function handleAddANewWallet(response, currenyChosen, doNotCreateANewWallet, countryLocale) {
  /*
    * Do not create wallet
    */
  if (doNotCreateANewWallet) {
    return response;
  }

  /*
  * Get locale to currency
  */
 let currenyChosen = helper.fetchCurrencyInformation(countryLocale);

  await wallet.addNewWallet(response.UserAttributes, currenyChosen, DB).then(function (result) { }, function (err) {
    throw new Error("Unable to add new wallet" + err);
  });
}

async function handleFetchUserInformation(response) {
  await fetchUser.getUser(response, cognitoidentityserviceprovider).then(function (result) {
    response.Username = result.Username;
    response.UserAttributes = result.UserAttributes;
    console.log("logged in the user " + JSON.stringify(result.Username));
  }, function (err) {
    throw new Error("Unable to signin from cognito  " + err);
  });
}

async function handleLogin(event, response) {
  let loginParams = helper.createLoginParameters(event);

  await login.initiateAuth(loginParams, cognitoidentityserviceprovider).then(function (result) {
    response = result;
  }, function (err) {
    throw new Error("Unable to login from cognito  " + err);
  });
  return response;
}

async function handleConfirmSignup(event) {
  let params = helper.createConfirmSignupParameters(event);

  await confirmSignup.confirmSignUp(params, cognitoidentityserviceprovider).then(function (result) { }, function (err) {
    throw new Error("Unable to confirm signup from cognito  " + err);
  });
}
