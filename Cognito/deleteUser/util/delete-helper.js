const deletUser = require('../cognito/delete-user');
const deleteUserParameter = require('../create-parameter/delete-user');

module.exports.handleDeleteUser = async (event) => {
  const params = deleteUserParameter.createParameter(event);
  let response;
  await deletUser.handleDeleteUser(params).then(
    (result) => {
      response = result;
    },
    (err) => {
      throw new Error(`Unable to delete user from cognito  ${err}`);
    },
  );
  return response;
};
