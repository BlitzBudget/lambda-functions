const login = require('../cognito/login');
const loginParameter = require('../create-parameter/login');

// Login to user
async function cognitoLogin(event, cognitoidentityserviceprovider) {
  let loginResponse = {};
  const params = loginParameter.createParameter(event);

  await login.initiateAuth(params, cognitoidentityserviceprovider).then(
    (result) => {
      loginResponse = result;
    },
    (err) => {
      throw new Error(`Unable to signin from cognito  ${err}`);
    },
  );
  return loginResponse;
}

module.exports.cognitoLogin = cognitoLogin;
