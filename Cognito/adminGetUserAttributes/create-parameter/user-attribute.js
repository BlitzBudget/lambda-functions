function UserAttribute() {}

const constants = require('../constants/constant');

const params = {
  UserPoolId: constants.USER_POOL_ID /* required */,
  /* Limit: 'NUMBER_VALUE', */
  /* PaginationToken: 'STRING_VALUE' */
};

UserAttribute.prototype.createParameter = (event) => {
  params.Username = event.params.querystring.userName;
  return params;
};

// Export object
module.exports = new UserAttribute();
