const cognitoLogin = require('../cognito/login');
const loginParameteres = require('../create-parameter/login');

async function login(event, response, cognitoidentityserviceprovider) {
  let loginResponse = response;
  const loginParams = loginParameteres.createParameter(event);

  await cognitoLogin.initiateAuth(loginParams, cognitoidentityserviceprovider).then(
    (result) => {
      loginResponse = result;
    },
    (err) => {
      throw new Error(`Unable to login from cognito  ${err}`);
    },
  );
  return loginResponse;
}

module.exports.login = login;
