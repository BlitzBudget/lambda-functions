const constants = require('../constants/constant');

module.exports.createParameter = (event) => ({
  ClientId: constants.CLIENT_ID,
  ConfirmationCode: event['body-json'].confirmationCode,
  Username: event['body-json'].username,
});
