const constants = require('../constants/constant');

module.exports.createParameter = (event) => ({
  ClientId: constants.CLIENT_ID,
  Username: event['body-json'].username,
});
