function Helper() {}

const constants = require('../constants/constant');

Helper.prototype.createParameters = (event) => ({
  ClientId: constants.CLIENT_ID,
  Username: event['body-json'].username,
});

// Export object
module.exports = new Helper();
