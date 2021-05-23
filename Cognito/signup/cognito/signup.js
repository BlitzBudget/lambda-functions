function Signup() {}

const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_LAMBDA_REGION,
});
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

Signup.prototype.signup = async (parameter) => {
  const response = await cognitoidentityserviceprovider.signUp(parameter).promise();
  return response;
};

// Export object
module.exports = new Signup();
