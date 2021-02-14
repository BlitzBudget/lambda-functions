var adminGetUser = function () {};

const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
let cognitoIdServiceProvider = new AWS.CognitoIdentityServiceProvider();

// Get User Attributes
adminGetUser.prototype.getUser = (params) => {
  return new Promise((resolve, reject) => {
    cognitoIdServiceProvider.adminGetUser(params, function (err, data) {
      if (err) reject(err);
      // an error occurred
      else resolve(data); // successful response
    });
  });
};

// Export object
module.exports = new adminGetUser();
