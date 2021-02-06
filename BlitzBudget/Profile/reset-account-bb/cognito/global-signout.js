var globalSignout = function () { };

// Global Signout Before Deleting the User
function globalSignoutFromAllDevices(event, cognitoIdServiceProvider) {
    var params = createParameters();

    return new Promise((resolve, reject) => {
        cognitoIdServiceProvider.globalSignOut(params, function (err, data) {
            if (err) {
                console.log("Unable to signout the user globally %j", paramsDelete.Usename);
                reject(err); // an error occurred
            } else {
                console.log("Successfully signout the user globally %j", paramsDelete.Usename);
                resolve('Global Signout Successful'); // successful response
            }
        });
    })

    function createParameters() {
        return {
            AccessToken: event['body-json'].accessToken
        };
    }
}

globalSignout.prototype.globalSignoutFromAllDevices = globalSignoutFromAllDevices;
// Export object
module.exports = new globalSignout(); 