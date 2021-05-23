function RefreshHelper() { }

const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_LAMBDA_REGION });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

RefreshHelper.prototype.handleRefreshToken = async (params) => {
  const response = await cognitoidentityserviceprovider.initiateAuth(params).promise();
  return response;
};

// Export object
module.exports = new RefreshHelper();
