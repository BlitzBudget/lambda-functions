const constants = require('../constants/constant');

module.exports.createParameter = (email) => ({
  UserPoolId: constants.USER_POOL_ID,
  /* required */
  Username: email,
});
