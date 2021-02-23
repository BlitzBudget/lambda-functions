const deleteUserParameter = require('./create-parameter/delete-user');
const deletUser = require('./cognito/delete-user');

async function handleDeleteUser(params, response) {
  let deleteResponse = response;
  await deletUser.handleDeleteUser(params).then(
    (result) => {
      deleteResponse = result;
    },
    (err) => {
      throw new Error(`Unable to delete user from cognito  ${err}`);
    },
  );
  return deleteResponse;
}

exports.handler = async (event) => {
  let response = {};
  const params = deleteUserParameter.createParameters(event);

  response = await handleDeleteUser(params, response);

  return response;
};
