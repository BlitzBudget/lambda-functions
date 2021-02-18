const helper = require('./utils/helper');
const changePassword = require('./user/change-password');

async function handleChangePassword(
  accessToken,
  previousPassword,
  newPassword,
) {
  let changePasswordResponse;
  const params = helper.changePasswordParameters(
    accessToken,
    previousPassword,
    newPassword,
  );

  await changePassword.changePassword(params).then(
    (result) => {
      changePasswordResponse = result;
    },
    (err) => {
      throw new Error(`Unable to change password from cognito  ${err}`);
    },
  );
  return changePasswordResponse;
}

exports.handler = async (event) => {
  const { accessToken } = event['body-json'];
  const { previousPassword } = event['body-json'];
  const { newPassword } = event['body-json'];

  const response = await handleChangePassword(
    accessToken,
    previousPassword,
    newPassword,
  );

  return response;
};
