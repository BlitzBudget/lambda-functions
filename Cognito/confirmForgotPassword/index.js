const helper = require('utils/helper');
const login = require('user/login');
const fetchUser = require('user/fetch-user');
const confirmForgotPassword = require('user/confirm-forgot-password');

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'eu-west-1',
});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  let response = {};

  response = await handleConfirmForgotPassword(event, response);

  response = await handleLogin(event, response);

  await handleFetchUser(response);

  return response;
};

async function handleFetchUser(response) {
  await fetchUser.getUser(response, cognitoidentityserviceprovider).then(
    function (result) {
      response.Username = result.Username;
      response.UserAttributes = result.UserAttributes;
      console.log('logged in the user ' + JSON.stringify(result.Username));
    },
    function (err) {
      throw new Error('Unable to get user attributes from cognito  ' + err);
    }
  );
}

async function handleLogin(event, response) {
  let loginParams = helper.loginParameters(event);

  await login.initiateAuth(loginParams, cognitoidentityserviceprovider).then(
    function (result) {
      response = result;
    },
    function (err) {
      throw new Error('Unable to login from cognito  ' + err);
    }
  );
  return response;
}

async function handleConfirmForgotPassword(event, response) {
  let params = helper.confirmForgotPasswordParameters(event);

  await confirmForgotPassword
    .confirmForgotPassword(params, cognitoidentityserviceprovider)
    .then(
      function (result) {
        response = result;
      },
      function (err) {
        throw new Error(
          'Unable to confirm forgot password from cognito  ' + err
        );
      }
    );
  return response;
}
