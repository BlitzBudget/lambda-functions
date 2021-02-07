var cognitoHelper = function () { };

const cognitoLogin = require('../cognito/login');
const cognitoFetchUser = require('../cognito/fetch-user-attribute');

async function loginUser(params, response, cognitoidentityserviceprovider) {
    await cognitoLogin.adminInitiateAuth(params, cognitoidentityserviceprovider).then(function (result) {
        console.log("The result of the initiate Auth is", result);
        response = result;
    }, function (err) {
        console.log("Unable to login ", err);
        throw new Error("Invalid username or password");
    });
    return response;
}


 /*
* Get User Attributes
*/
async function fetchUserAttributes(response, cognitoidentityserviceprovider) {
    await cognitoFetchUser.getUser(response, cognitoidentityserviceprovider).then(function (result) {
        response.Username = result.Username;
        response.UserAttributes = result.UserAttributes;
        console.log("logged in the user " + JSON.stringify(result.Username));
    }, function (err) {
        console.log("Unable to get the user information ", err);
        throw new Error("Unable to retrieve user information ", err);
    });
}

cognitoHelper.prototype.loginUser = loginUser;
cognitoHelper.prototype.fetchUserAttributes = fetchUserAttributes;
// Export object
module.exports = new cognitoHelper();