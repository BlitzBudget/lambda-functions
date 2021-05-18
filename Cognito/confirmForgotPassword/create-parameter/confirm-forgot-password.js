function ConfirmForgotPassword() {}

ConfirmForgotPassword.prototype.createParameter = (event) => ({
  ClientId: process.env.CLIENT_ID,
  /* required */
  ConfirmationCode: event['body-json'].confirmationCode,
  /* required */
  Password: event['body-json'].password,
  /* required */
  Username: event['body-json'].username,
});

// Export object
module.exports = new ConfirmForgotPassword();
