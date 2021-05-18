module.exports.createParameter = (email) => ({
  UserPoolId: process.env.USER_POOL_ID,
  /* required */
  Username: email,
});
