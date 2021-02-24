const resendConfirmationHelper = require('./utils/resend-confirmation-code-helper');

exports.handler = async (event) => {
  const response = await resendConfirmationHelper.resendConfirmationCode(event);
  return response;
};
