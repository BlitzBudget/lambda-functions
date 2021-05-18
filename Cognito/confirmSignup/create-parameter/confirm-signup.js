module.exports.createParameter = (event) => ({
  ClientId: process.env.USER_POOL_ID,
  ConfirmationCode: event['body-json'].confirmationCode,
  Username: event['body-json'].username,
});
