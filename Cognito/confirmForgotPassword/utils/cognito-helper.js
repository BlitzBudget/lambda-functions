function CognitoHelper() {}

const AWS = require('aws-sdk');
const confirmForgotPasswordParameter = require('../create-parameter/confirm-forgot-password');
const loginParameter = require('../create-parameter/login');
const cognitoLogin = require('../cognito/login');
const cognitoFetchUser = require('../cognito/fetch-user');
const cognitoConfirmForgotPassword = require('../cognito/confirm-forgot-password');
const constants = require('../constants/constant');

AWS.config.update({
  region: constants.EU_WEST_ONE,
});
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

async function fetchUser(response) {
  await cognitoFetchUser.getUser(response, cognitoidentityserviceprovider).then(
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

async function login(event, response) {
  const loginParams = loginParameter.createParameter(event);
  let loginResponse = response;

  await cognitoLogin.initiateAuth(loginParams, cognitoidentityserviceprovider).then(
    (result) => {
      loginResponse = result;
    },
    (err) => {
      throw new Error(`Unable to login from cognito  ${err}`);
    },
  );
  return loginResponse;
}

async function confirmForgotPassword(event, response) {
  const params = confirmForgotPasswordParameter.createParameter(event);
  let confirmForgotPasswordResponse = response;

  await cognitoConfirmForgotPassword
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

CognitoHelper.prototype.confirmForgotPassword = confirmForgotPassword;
CognitoHelper.prototype.login = login;
CognitoHelper.prototype.fetchUser = fetchUser;
// Export object
module.exports = new CognitoHelper();
