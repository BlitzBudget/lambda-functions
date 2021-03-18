const cognitoHelper = require('./utils/cognito-helper');

exports.handler = async (event) => {
  let response = {};

  response = await cognitoHelper.confirmForgotPassword(event, response);

  response = await cognitoHelper.login(event, response);

  await cognitoHelper.fetchUser(response);

  return response;
};
