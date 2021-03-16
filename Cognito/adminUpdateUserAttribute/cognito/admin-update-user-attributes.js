const AdminUpdateUser = () => {};

const AWS = require('aws-sdk');

AWS.config.update({
  region: 'eu-west-1',
});
const cognitoIdServiceProvider = new AWS.CognitoIdentityServiceProvider();

// Update User Attributes
AdminUpdateUser.prototype.updateAttributes = async (params) => {
  console.log(`update attribute - ${JSON.stringify(params)}`);

  const response = await cognitoIdServiceProvider.adminUpdateUserAttributes(params).promise();
  return response;
};

// Export object
module.exports = new AdminUpdateUser();
