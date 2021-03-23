const cognitoLogin = require('../cognito/login');
const loginParameteres = require('../create-parameter/login');

async function login(event, cognitoidentityserviceprovider) {
  let response;
  const loginParams = loginParameteres.createParameter(event);

  await cognitoLogin.initiateAuth(loginParams, cognitoidentityserviceprovider).then(
    (result) => {
      response = result;
    },
    (err) => {
      throw new Error(`Unable to login from cognito  ${err}`);
    },
  );
  return response;
}

module.exports.login = login;
