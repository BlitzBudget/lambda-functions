var login = function () { };

/*
 * Admin initiate authentication
 */
function adminInitiateAuth(params, cognitoidentityserviceprovider) {
    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.adminInitiateAuth(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                console.log(data); // successful response
                resolve(data);
            }
        });
    });
}

login.prototype.adminInitiateAuth = adminInitiateAuth;
// Export object
module.exports = new login();