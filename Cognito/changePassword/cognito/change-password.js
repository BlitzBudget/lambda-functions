function ChangePassword() { }

const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_LAMBDA_REGION });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

ChangePassword.prototype.changePassword = async (params) => {
  const response = await cognitoidentityserviceprovider.changePassword(params).promise();
  return response;
};

// Export object
module.exports = new ChangePassword();
