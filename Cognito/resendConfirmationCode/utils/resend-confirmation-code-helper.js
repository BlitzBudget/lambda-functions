const resendConfirmationParameter = require('../create-parameter/resend-confirmation-code');
const cognitoResendConfirmation = require('../cognito/resend-confirmation');

async function resendConfirmationCode(event, response) {
  const params = resendConfirmationParameter.createParameter(event);
  let resendResponse = response;
  await cognitoResendConfirmation.resendConfirmationCode(params).then(
    (result) => {
      resendResponse = result;
    },
    (err) => {
      throw new Error(`Unable to confirm signup from cognito  ${err}`);
    },
  );
  return resendResponse;
}

module.exports.resendConfirmationCode = resendConfirmationCode;
