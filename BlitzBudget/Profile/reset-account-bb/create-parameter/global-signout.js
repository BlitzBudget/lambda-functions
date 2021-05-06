module.exports.createParameter = (event) => ({
  AccessToken: event['body-json'].accessToken,
});
