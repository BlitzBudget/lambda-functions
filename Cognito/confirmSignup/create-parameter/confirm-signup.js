module.exports.createParameter = (event) => ({
  ClientId: process.env.CLIENT_ID,
  ConfirmationCode: event['body-json'].confirmationCode,
  Username: event['body-json'].username,
});
