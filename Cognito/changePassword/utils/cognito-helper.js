function CognitoHelper() {}

const changePasswordParameter = require('../create-parameter/change-password');
const cognitoChangePassword = require('../cognito/change-password');

async function changePassword(
  accessToken,
  previousPassword,
  newPassword,
) {
  let changePasswordResponse;
  const params = changePasswordParameter.changePasswordParameters(
    accessToken,
    previousPassword,
    newPassword,
  );

  await cognitoChangePassword.changePassword(params).then(
    (result) => {
      changePasswordResponse = result;
    },
    (err) => {
      throw new Error(`Unable to change password from cognito  ${err}`);
    },
  );
  return changePasswordResponse;
}

CognitoHelper.prototype.changePassword = changePassword;

// Export object
module.exports = new CognitoHelper();
