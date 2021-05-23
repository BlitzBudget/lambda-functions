function ForgotPassword() { }

const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_LAMBDA_REGION });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

ForgotPassword.prototype.handleForgotPassword = async (params) => {
  const response = await cognitoidentityserviceprovider.forgotPassword(params).promise();
  return response;
};

// Export object
module.exports = new ForgotPassword();
