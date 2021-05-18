function Login() {}

const constants = require('../constants/constant');

Login.prototype.createParameter = (event) => ({
  AuthFlow: constants.AUTH_FLOW,
  ClientId: process.env.USER_POOL_ID,
  AuthParameters: {
    USERNAME: event['body-json'].username,
    PASSWORD: event['body-json'].password,
  },
});

// Export object
module.exports = new Login();
