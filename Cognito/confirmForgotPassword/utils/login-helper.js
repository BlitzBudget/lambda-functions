const loginParameter = require('../create-parameter/login');
const cognitoLogin = require('../cognito/login');

module.exports.login = async (event, response, cognitoidentityserviceprovider) => {
  const loginParams = loginParameter.createParameter(event);

  await cognitoLogin.initiateAuth(loginParams, cognitoidentityserviceprovider).then(
    (result) => {
      response.Login = result;
    },
    (err) => {
      throw new Error(`Unable to login from cognito  ${err}`);
    },
  );
};
