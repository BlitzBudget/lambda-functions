const fetchUser = require('../fetch/user');

// Fetch Users
async function fetchUserFromCognito(response, cognitoidentityserviceprovider) {
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

module.exports.fetchUserFromCognito = fetchUserFromCognito;
