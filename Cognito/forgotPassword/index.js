const helper = require('helper');
const forgotPassword = require('forgot-password');

exports.handler = async (event) => {
  let response = {};
  let params = helper.createParameters(event);

  response = await handleForgotPassword(params, response);

  return response;
};

async function handleForgotPassword(params, response) {
  await forgotPassword.handleForgotPassword(params).then(
    function (result) {
      response = result;
    },
    function (err) {
      throw new Error(
        'Unable to initialize forgot password flow from cognito  ' + err
      );
    }
  );
  return response;
}
