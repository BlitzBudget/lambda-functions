const Helper = () => {};

const userPoolId = 'eu-west-1_cjfC8qNiB';
const params = {
  UserPoolId: userPoolId /* required */,
  /* Limit: 'NUMBER_VALUE', */
  /* PaginationToken: 'STRING_VALUE' */
};

Helper.prototype.createParameters = (event) => {
  params.Username = event.params.querystring.userName;
  return params;
};

// Export object
module.exports = new Helper();
