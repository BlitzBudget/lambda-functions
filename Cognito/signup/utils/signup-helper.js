function SignupHelper() {}

const cognitoSignup = require('../cognito/signup');
const signupParameter = require('../create-parameter/signup');

// Signup User
async function signupUser(event) {
  const parameters = signupParameter.createParameter(event);

  const result = await cognitoSignup.signup(parameters).then(
    (response) => response,
    (err) => {
      throw new Error(`Unable to signin from cognito  ${err}`);
    },
  );
  return result;
}

SignupHelper.prototype.signupUser = signupUser;

// Export object
module.exports = new SignupHelper();
