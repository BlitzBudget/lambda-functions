module.exports.createParameters = (event) => ({
  AccessToken: event['body-json'].accessToken,
});
