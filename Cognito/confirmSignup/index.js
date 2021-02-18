const AWS = require('aws-sdk');
const wallet = require('./wallet/add-new-wallet');
const login = require('./user/login');
const fetchUser = require('./user/fetch-user');
const confirmSignup = require('./user/confirm-signup');
const helper = require('./utils/helper');

AWS.config.update({ region: 'eu-west-1' });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

// Create the DynamoDB service object
const DB = new AWS.DynamoDB.DocumentClient();

async function handleAddANewWallet(
  response,
  doNotCreateANewWallet,
  countryLocale,
) {
  let walletResponse = response;

  /*
   * Do not create wallet
   */
  if (doNotCreateANewWallet) {
    return walletResponse;
  }

  /*
   * Get locale to currency
   */
  const currency = helper.fetchCurrencyInformation(countryLocale);

  await wallet.addNewWallet(response.UserAttributes, currency, DB).then(
    (addResponse) => {
      walletResponse = addResponse.Wallet;
    },
    (err) => {
      throw new Error(`Unable to add new wallet${err}`);
    },
  );
  return walletResponse;
}

async function handleFetchUserInformation(response) {
  await fetchUser.getUser(response, cognitoidentityserviceprovider).then(
    (result) => {
      response.Username = result.Username;
      response.UserAttributes = result.UserAttributes;
      console.log(`logged in the user ${JSON.stringify(result.Username)}`);
    },
    (err) => {
      throw new Error(`Unable to signin from cognito  ${err}`);
    },
  );
}

async function handleLogin(event, response) {
  let loginResponse = response;
  const loginParams = helper.createLoginParameters(event);

  await login.initiateAuth(loginParams, cognitoidentityserviceprovider).then(
    (result) => {
      loginResponse = result;
    },
    (err) => {
      throw new Error(`Unable to login from cognito  ${err}`);
    },
  );
  return loginResponse;
}

async function handleConfirmSignup(event) {
  const params = helper.createConfirmSignupParameters(event);

  await confirmSignup
    .confirmSignUp(params, cognitoidentityserviceprovider)
    .then(
      () => {},
      (err) => {
        throw new Error(`Unable to confirm signup from cognito  ${err}`);
      },
    );
}

exports.handler = async (event) => {
  let response = {};
  const doNotCreateANewWallet = event['body-json'].doNotCreateWallet;
  const countryLocale = event.params.header['CloudFront-Viewer-Country'];

  await handleConfirmSignup(event);

  response = await handleLogin(event, response);

  await handleFetchUserInformation(response);

  await handleAddANewWallet(
    response,
    doNotCreateANewWallet,
    countryLocale,
  );

  return response;
};
