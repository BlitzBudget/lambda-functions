const AWS = require('aws-sdk');
const constants = require('./constants/constant');
const confirmForgotPasswordHelper = require('./utils/confirm-forgot-password-helper');
const fetchUserHelper = require('./utils/fetch-user-helper');
const loginHelper = require('./utils/login-helper');

AWS.config.update({
  region: constants.EU_WEST_ONE,
});
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  const response = await confirmForgotPasswordHelper.confirmForgotPassword(
    event,
    cognitoidentityserviceprovider,
  );

  await loginHelper.login(event, response, cognitoidentityserviceprovider);

  await fetchUserHelper.fetchUser(response, cognitoidentityserviceprovider);

  return response;
};
