const constants = require('../constants/constant');

module.exports.createParameter = (event) => ({
  AuthFlow: constants.USER_PASSWORD_AUTH,
  ClientId: process.env.USER_POOL_ID,
  AuthParameters: {
    USERNAME: event['body-json'].username,
    PASSWORD: event['body-json'].password,
  },
});
