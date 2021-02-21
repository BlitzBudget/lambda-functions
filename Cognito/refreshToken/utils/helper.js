function Helper() {}

const constants = require('../constants/constant');

Helper.prototype.createParameters = (event) => ({
  AuthFlow: constants.REFRESH_TOKEN_AUTH,
  ClientId: constants.CLIENT_ID,
  AuthParameters: {
    REFRESH_TOKEN: event['body-json'].refreshToken,
  },
});

// Export object
module.exports = new Helper();
