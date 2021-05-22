function Signup() {}

const AWS = require('aws-sdk');
const signupParameter = require('../create-parameter/signup');

AWS.config.update({
  region: process.env.AWS_LAMBDA_REGION,
});
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

Signup.prototype.signup = async (event) => {
  const parameter = signupParameter.createParameter(event);
  const response = await cognitoidentityserviceprovider.signUp(parameter).promise();
  return response;
};

// Export object
module.exports = new Signup();
