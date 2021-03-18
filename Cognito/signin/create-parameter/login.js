function Login() {}

const constants = require('../constants/constant');

Login.prototype.createParameter = (event) => ({
  AuthFlow: constants.AUTH_FLOW,
  ClientId: constants.CLIENT_ID,
  AuthParameters: {
    USERNAME: event['body-json'].username,
    PASSWORD: event['body-json'].password,
  },
});

// Export object
module.exports = new Login();
