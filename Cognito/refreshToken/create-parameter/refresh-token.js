const constants = require('../constants/constant');

module.exports.createParameter = (event) => ({
  AuthFlow: constants.REFRESH_TOKEN_AUTH,
  ClientId: constants.CLIENT_ID,
  AuthParameters: {
    REFRESH_TOKEN: event['body-json'].refreshToken,
  },
});
