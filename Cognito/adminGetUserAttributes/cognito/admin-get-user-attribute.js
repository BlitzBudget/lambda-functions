function AdminGetUser() {}

const AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-west-1' });
const cognitoIdServiceProvider = new AWS.CognitoIdentityServiceProvider();

// Get User Attributes
AdminGetUser.prototype.getUser = async (params) => {
  const response = await cognitoIdServiceProvider.adminGetUser(params).promise();
  return response;
};

// Export object
module.exports = new AdminGetUser();
