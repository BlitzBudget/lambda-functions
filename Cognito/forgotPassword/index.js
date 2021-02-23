const forgotPasswordHelper = require('./utils/forgot-password-helper');

exports.handler = async (event) => {
  let response = {};

  response = await forgotPasswordHelper.forgotPassword(event, response);

  return response;
};
