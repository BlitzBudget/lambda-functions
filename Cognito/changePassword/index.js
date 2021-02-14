const helper = require('utils/helper');
const changePassword = require('user/change-password');

exports.handler = async (event) => {
  let accessToken = event['body-json'].accessToken;
  let previousPassword = event['body-json'].previousPassword;
  let newPassword = event['body-json'].newPassword;

  let response = await handleChangePassword(
    accessToken,
    previousPassword,
    newPassword,
    response
  );

  return response;
};

async function handleChangePassword(
  accessToken,
  previousPassword,
  newPassword,
  response
) {
  let params = helper.changePasswordParameters(
    accessToken,
    previousPassword,
    newPassword
  );

  await changePassword.changePassword(params).then(
    function (result) {
      response = result;
    },
    function (err) {
      throw new Error('Unable to change password from cognito  ' + err);
    }
  );
  return response;
}
