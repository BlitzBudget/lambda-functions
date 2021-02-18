const AWS = require('aws-sdk');
const helper = require('./utils/helper');
const login = require('./user/login');
const fetchUser = require('./user/fetch-user');
const confirmForgotPassword = require('./user/confirm-forgot-password');

AWS.config.update({
  region: 'eu-west-1',
});
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

async function handleFetchUser(response) {
  await fetchUser.getUser(response, cognitoidentityserviceprovider).then(
    (result) => {
      response.Username = result.Username;
      response.UserAttributes = result.UserAttributes;
      console.log(`logged in the user ${JSON.stringify(result.Username)}`);
    },
    (err) => {
      throw new Error(`Unable to get user attributes from cognito  ${err}`);
    },
  );
}

async function handleLogin(event, response) {
  const loginParams = helper.loginParameters(event);
  let loginResponse = response;

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

async function handleConfirmForgotPassword(event, response) {
  const params = helper.confirmForgotPasswordParameters(event);
  let confirmForgotPasswordResponse = response;

  await confirmForgotPassword
    .confirmForgotPassword(params, cognitoidentityserviceprovider)
    .then(
      (result) => {
        confirmForgotPasswordResponse = result;
      },
      (err) => {
        throw new Error(
          `Unable to confirm forgot password from cognito  ${err}`,
        );
      },
    );
  return confirmForgotPasswordResponse;
}

exports.handler = async (event) => {
  let response = {};

  response = await handleConfirmForgotPassword(event, response);

  response = await handleLogin(event, response);

  await handleFetchUser(response);

  return response;
};
