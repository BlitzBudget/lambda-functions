var helper = function () {};

helper.prototype.createParameters = (event) => {
  return {
    AccessToken: event['body-json'].accessToken,
  };
};

// Export object
module.exports = new helper();
