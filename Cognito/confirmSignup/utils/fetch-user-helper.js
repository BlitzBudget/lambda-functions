const fetchUser = require('../cognito/fetch-user');

async function fetchUserInformation(response, cognitoidentityserviceprovider) {
  await fetchUser.getUser(response, cognitoidentityserviceprovider).then(
    (result) => {
      response.Username = result.Username;
      response.UserAttributes = result.UserAttributes;
      console.log(`logged in the user ${JSON.stringify(result.Username)}`);
    },
    (err) => {
      throw new Error(`Unable to signin from cognito  ${err}`);
    },
  );
  return response;
}

module.exports.fetchUserInformation = fetchUserInformation;
