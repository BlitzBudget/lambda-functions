const constants = require('../constants/constant');

module.exports.createParameter = (event) => ({
  AuthFlow: constants.REFRESH_TOKEN_AUTH,
  ClientId: process.env.USER_POOL_ID,
  AuthParameters: {
    REFRESH_TOKEN: event['body-json'].refreshToken,
  },
});
