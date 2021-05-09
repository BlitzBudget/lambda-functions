const cognitoConfirmForgotPassword = require('../cognito/confirm-forgot-password');
const confirmForgotPasswordParameter = require('../create-parameter/confirm-forgot-password');

module.exports.confirmForgotPassword = async (event, cognitoidentityserviceprovider) => {
  const params = confirmForgotPasswordParameter.createParameter(event);
  let response;

  await cognitoConfirmForgotPassword
    .confirmForgotPassword(params, cognitoidentityserviceprovider)
    .then(
      (result) => {
        response = result;
      },
      (err) => {
        throw new Error(
          `Unable to confirm forgot password from cognito  ${err}`,
        );
      },
    );
  return response;
};
