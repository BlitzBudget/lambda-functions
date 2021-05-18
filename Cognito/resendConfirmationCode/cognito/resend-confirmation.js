function ResendConfirmation() {}

const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_LAMBDA_REGION });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

ResendConfirmation.prototype.resendConfirmationCode = async (params) => {
  const response = await cognitoidentityserviceprovider.resendConfirmationCode(params).promise();
  return response;
};

// Export object
module.exports = new ResendConfirmation();
