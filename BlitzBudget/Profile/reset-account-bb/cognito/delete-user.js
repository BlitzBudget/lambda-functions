const DeleteUser = () => {};

// Delete Cognito Account
async function deleteCognitoAccount(paramsDelete, cognitoIdServiceProvider) {
  const response = await cognitoIdServiceProvider.adminDeleteUser(paramsDelete).promise();
  return response;
}

DeleteUser.prototype.deleteCognitoAccount = deleteCognitoAccount;
// Export object
module.exports = new DeleteUser();
