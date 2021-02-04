var fetchUser = function () { };

const AWS = require('aws-sdk')
AWS.config.update({ region: 'eu-west-1' });
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

fetchUser.prototype.getUser = (response) => {
    let params = {
        AccessToken: response.AuthenticationResult.AccessToken /* required */
    };


    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.getUser(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            }
            else {
                console.log(data);           // successful response
                resolve(data);
            }
        });
    });
}

// Export object
module.exports = new fetchUser();