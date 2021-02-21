const Signup = () => {};

const AWS = require('aws-sdk');
const constants = require('../constants/constant');
const signupParameter = require('../create-parameter/signup');

AWS.config.update({
  region: constants.EU_WEST_ONE,
});
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

Signup.prototype.signup = (event) => new Promise((resolve, reject) => {
  const parameter = signupParameter.createParameter(event);

  cognitoidentityserviceprovider.signUp(parameter, (err, data) => {
    if (err) {
      console.log(err, err.stack); // an error occurred
      reject(err);
    } else {
      console.log(data); // successful response
      resolve(data);
    }
  });
});

// Export object
module.exports = new Signup();
