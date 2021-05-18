function LoginParameter() {}

const constants = require('../constants/constant');

LoginParameter.prototype.createParameter = (event) => ({
  AuthFlow: constants.USER_PASSWORD_AUTH,
  ClientId: process.env.USER_POOL_ID,
  /* required */
  AuthParameters: {
    USERNAME: event['body-json'].username,
    PASSWORD: event['body-json'].password,
  },
});

// Export object
module.exports = new LoginParameter();
