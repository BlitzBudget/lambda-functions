var refreshToken = function () {};

const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

refreshToken.prototype.handleRefreshToken = (params) => {
  return new Promise((resolve, reject) => {
    cognitoidentityserviceprovider.initiateAuth(params, function (err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        reject(err);
      } else {
        console.log(data); // successful response
        resolve(data);
      }
    });
  });
};

// Export object
module.exports = new refreshToken();
