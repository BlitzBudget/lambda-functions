const refreshHelperParameter = require('../create-parameter/refresh-token');
const cognitoRefreshToken = require('../cognito/refresh-token');

async function refreshToken(event) {
  let response;
  const params = refreshHelperParameter.createParameter(event);

  await cognitoRefreshToken.handleRefreshToken(params).then(
    (result) => {
      response = result;
    },
    (err) => {
      throw new Error(`Unable to refresh token from cognito  ${err}`);
    },
  );
  return response;
}

module.exports.refreshToken = refreshToken;
