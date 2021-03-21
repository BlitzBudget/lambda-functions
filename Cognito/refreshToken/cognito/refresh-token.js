function RefreshHelper() {}

const AWS = require('aws-sdk');
const constants = require('../constants/constant');

AWS.config.update({ region: constants.EU_WEST_ONE });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

RefreshHelper.prototype.handleRefreshToken = async (params) => {
  const response = await cognitoidentityserviceprovider.initiateAuth(params).promise();
  return response;
};

// Export object
module.exports = new RefreshHelper();
