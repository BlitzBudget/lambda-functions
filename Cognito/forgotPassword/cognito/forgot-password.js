function ForgotPassword() {}

const AWS = require('aws-sdk');
const constants = require('../constants/constant');

AWS.config.update({ region: constants.AWS_LAMBDA_REGION });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

ForgotPassword.prototype.handleForgotPassword = async (params) => {
  const response = await cognitoidentityserviceprovider.forgotPassword(params).promise();
  return response;
};

// Export object
module.exports = new ForgotPassword();
