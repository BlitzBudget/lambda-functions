function ChangePassword() {}

const AWS = require('aws-sdk');
const constants = require('../constants/constant');

AWS.config.update({ region: constants.EU_WEST_ONE });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

ChangePassword.prototype.changePassword = async (params) => {
  const response = await cognitoidentityserviceprovider.changePassword(params).promise();
  return response;
};

// Export object
module.exports = new ChangePassword();
