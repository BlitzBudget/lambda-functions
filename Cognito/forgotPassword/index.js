const helper = require('./helper');
const forgotPassword = require('./forgot-password');

async function handleForgotPassword(params, response) {
  let forgotPasswordResponse = response;
  await forgotPassword.handleForgotPassword(params).then(
    (result) => {
      forgotPasswordResponse = result;
    },
    (err) => {
      throw new Error(
        `Unable to initialize forgot password flow from cognito  ${err}`,
      );
    },
  );
  return forgotPasswordResponse;
}

exports.handler = async (event) => {
  let response = {};
  const params = helper.createParameters(event);

  response = await handleForgotPassword(params, response);

  return response;
};
