function Signup() {}

const AWS = require('aws-sdk');
const constants = require('../constants/constant');
const signupParameter = require('../create-parameter/signup');

AWS.config.update({
  region: constants.AWS_LAMBDA_REGION,
});
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

Signup.prototype.signup = async (event) => {
  const parameter = signupParameter.createParameter(event);
  const response = await cognitoidentityserviceprovider.signUp(parameter).promise();
  return response;
};

// Export object
module.exports = new Signup();
