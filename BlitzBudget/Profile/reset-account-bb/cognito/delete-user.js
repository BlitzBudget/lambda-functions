const DeleteUser = () => {};

// Delete Cognito Account
function deleteCognitoAccount(paramsDelete, cognitoIdServiceProvider) {
  return new Promise((resolve, reject) => {
    cognitoIdServiceProvider.adminDeleteUser(
      paramsDelete,
      (err) => {
        if (err) {
          console.log('Unable to deleted the user %j', paramsDelete.Usename);
          reject(err); // an error occurred
        } else {
          console.log('Successfully deleted the user %j', paramsDelete.Usename);
          resolve('Delete Account Success'); // successful response
        }
      },
    );
  });
}

DeleteUser.prototype.deleteCognitoAccount = deleteCognitoAccount;
// Export object
module.exports = new DeleteUser();
