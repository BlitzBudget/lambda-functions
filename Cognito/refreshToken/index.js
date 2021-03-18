const refreshTokenHelper = require('./utils/refresh-token-helper');

exports.handler = async (event) => {
  const response = await refreshTokenHelper.refreshToken(event);
  return response;
};
