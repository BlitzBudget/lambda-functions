const AdminUpdateUser = () => {};

const AWS = require('../../changePassword/cognito/node_modules/aws-sdk');

AWS.config.update({
  region: 'eu-west-1',
});
const cognitoIdServiceProvider = new AWS.CognitoIdentityServiceProvider();

// Update User Attributes
AdminUpdateUser.prototype.updateAttributes = (params) => {
  console.log(`update attribute - ${JSON.stringify(params)}`);

  return new Promise((resolve, reject) => {
    cognitoIdServiceProvider.adminUpdateUserAttributes(
      params,
      (err, data) => {
        if (err) reject(err);
        // an error occurred
        else resolve(data); // successful response
      },
    );
  });
};

// Export object
module.exports = new AdminUpdateUser();
