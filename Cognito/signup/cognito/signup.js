const Signup = () => {};

const AWS = require('aws-sdk');
const signupParameter = require('../create-parameter/signup');

AWS.config.update({
  region: 'eu-west-1',
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
