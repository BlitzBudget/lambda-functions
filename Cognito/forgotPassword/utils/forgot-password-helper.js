const forgotPasswordParameter = require('../create-parameter/forgot-password');
const cognitoForgotPassword = require('../cognito/forgot-password');

async function forgotPassword(event, response) {
  const params = forgotPasswordParameter.createParameter(event);

  let forgotPasswordResponse = response;
  await cognitoForgotPassword.handleForgotPassword(params).then(
    (result) => {
      forgotPasswordResponse = result;
    },
    (err) => {
      throw new Error(
        `Unable to initialize forgot password flow from cognito  ${err}`,
      );
    },
  );
  return forgotPasswordResponse;
}

module.exports.forgotPassword = forgotPassword;
