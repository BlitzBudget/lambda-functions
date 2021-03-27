function AdminUpdateUser() {}

const AWS = require('aws-sdk');
const constants = require('../constants/constant');

AWS.config.update({
  region: constants.EU_WEST_ONE,
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
