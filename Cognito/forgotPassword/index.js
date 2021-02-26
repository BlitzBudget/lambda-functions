const forgotPasswordHelper = require('./utils/forgot-password-helper');

exports.handler = async (event) => {
  const response = await forgotPasswordHelper.forgotPassword(event);

  return response;
};
