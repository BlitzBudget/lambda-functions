var deleteUser = function () { };

// Delete Cognito Account
function deleteCognitoAccount(paramsDelete, cognitoIdServiceProvider) {

    return new Promise((resolve, reject) => {
        cognitoIdServiceProvider.adminDeleteUser(paramsDelete, function (err, data) {
            if (err) {
                console.log("Unable to deleted the user %j", paramsDelete.Usename);
                reject(err); // an error occurred
            } else {
                console.log("Successfully deleted the user %j", paramsDelete.Usename);
                resolve('Delete Account Success'); // successful response
            }
        });
    });
}

deleteUser.prototype.deleteCognitoAccount = deleteCognitoAccount;
// Export object
module.exports = new deleteUser();