function DeleteUser() { }

const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_LAMBDA_REGION });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

DeleteUser.prototype.handleDeleteUser = async (params) => {
  const response = await cognitoidentityserviceprovider.deleteUser(params).promise();
  return response;
};

// Export object
module.exports = new DeleteUser();
