module.exports.createParameter = (event) => ({
  ClientId: process.env.USER_POOL_ID,
  Username: event['body-json'].username,
});
