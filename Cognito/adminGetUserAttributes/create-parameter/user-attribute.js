function UserAttribute() {}

UserAttribute.prototype.createParameter = (event) => {
  const params = {
    UserPoolId: process.env.USER_POOL_ID /* required */,
    /* Limit: 'NUMBER_VALUE', */
    /* PaginationToken: 'STRING_VALUE' */
  };
  params.Username = event.params.querystring.userName;
  return params;
};

// Export object
module.exports = new UserAttribute();
