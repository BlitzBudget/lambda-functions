const helper = require('./utils/helper');
const refreshToken = require('./cognito/refresh-token');

exports.handler = async (event) => {
  let response = {};
  const params = helper.createParameters(event);

  await refreshToken.handleRefreshToken(params).then(
    (result) => {
      response = result;
    },
    (err) => {
      throw new Error(`Unable to refresh token from cognito  ${err}`);
    },
  );

  return response;
};
