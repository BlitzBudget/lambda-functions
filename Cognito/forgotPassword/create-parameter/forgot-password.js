module.exports.createParameter = (event) => ({
  ClientId: process.env.CLIENT_ID,
  Username: event['body-json'].username,
});
