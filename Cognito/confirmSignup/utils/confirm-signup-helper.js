const cognitoConfirmSignup = require('../cognito/confirm-signup');
const confirmSignupParameteres = require('../create-parameter/confirm-signup');

async function confirmSignup(event, cognitoidentityserviceprovider) {
  const params = confirmSignupParameteres.createParameter(event);

  await cognitoConfirmSignup
    .confirmSignUp(params, cognitoidentityserviceprovider)
    .then(
      () => {},
      (err) => {
        throw new Error(`Unable to confirm signup from cognito  ${err}`);
      },
    );
}

module.exports.confirmSignup = confirmSignup;
