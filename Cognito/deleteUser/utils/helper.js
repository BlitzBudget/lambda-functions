function Helper() {}

Helper.prototype.createParameters = (event) => ({
  AccessToken: event['body-json'].accessToken,
});

// Export object
module.exports = new Helper();
