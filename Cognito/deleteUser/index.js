const deleteUserHelper = require('./util/delete-helper');

exports.handler = async (event) => {
  let response = {};

  response = await deleteUserHelper.handleDeleteUser(event);

  return response;
};
