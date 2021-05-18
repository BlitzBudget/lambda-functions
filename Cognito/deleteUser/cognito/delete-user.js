function DeleteUser() {}

const AWS = require('aws-sdk');
const constants = require('../constants/constant');

AWS.config.update({ region: constants.AWS_LAMBDA_REGION });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

DeleteUser.prototype.handleDeleteUser = async (params) => {
  const response = await cognitoidentityserviceprovider.deleteUser(params).promise();
  return response;
};

// Export object
module.exports = new DeleteUser();
