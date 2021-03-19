const cognitoFetchUser = require('../cognito/fetch-user');

module.exports.fetchUser = async (response, cognitoidentityserviceprovider) => {
  await cognitoFetchUser.getUser(response, cognitoidentityserviceprovider).then(
    (result) => {
      response.Username = result.Username;
      response.UserAttributes = result.UserAttributes;
      console.log(`logged in the user ${JSON.stringify(result.Username)}`);
    },
    (err) => {
      throw new Error(`Unable to get user attributes from cognito  ${err}`);
    },
  );
};
