function ConfirmForgotPassword() {}

const constants = require('../constants/constant');

ConfirmForgotPassword.prototype.createParameter = (event) => ({
  ClientId: constants.CLIENT_ID,
  /* required */
  ConfirmationCode: event['body-json'].confirmationCode,
  /* required */
  Password: event['body-json'].password,
  /* required */
  Username: event['body-json'].username,
});

// Export object
module.exports = new ConfirmForgotPassword();
