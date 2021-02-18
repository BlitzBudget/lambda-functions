const helper = require('./helper');
const resendConfirmation = require('./resend-confirmation');

async function handleResendConfirmationCode(params, response) {
  let resendResponse = response;
  await resendConfirmation.resendConfirmationCode(params).then(
    (result) => {
      resendResponse = result;
    },
    (err) => {
      throw new Error(`Unable to confirm signup from cognito  ${err}`);
    },
  );
  return resendResponse;
}

exports.handler = async (event) => {
  let response = {};
  const params = helper.createParameter(event);

  response = await handleResendConfirmationCode(params, response);

  return response;
};
