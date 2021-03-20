function ResendConfirmation() {}

const AWS = require('aws-sdk');
const constants = require('../constants/constant');

AWS.config.update({ region: constants.EU_WEST_ONE });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

ResendConfirmation.prototype.resendConfirmationCode = async (params) => {
  const response = await cognitoidentityserviceprovider.resendConfirmationCode(params).promise();
  return response;
};

// Export object
module.exports = new ResendConfirmation();
