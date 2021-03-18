const cognitoHelper = require('./utils/cognito-helper');

exports.handler = async (event) => {
  const { accessToken } = event['body-json'];
  const { previousPassword } = event['body-json'];
  const { newPassword } = event['body-json'];

  const response = await cognitoHelper.changePassword(
    accessToken,
    previousPassword,
    newPassword,
  );

  return response;
};
