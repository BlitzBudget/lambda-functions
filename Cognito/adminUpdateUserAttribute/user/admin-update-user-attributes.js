var adminUpdateUser = function () { };

const AWS = require('aws-sdk')
AWS.config.update({
    region: 'eu-west-1'
});
let cognitoIdServiceProvider = new AWS.CognitoIdentityServiceProvider();

// Update User Attributes
adminUpdateUser.prototype.updateAttributes = (params) => {

    console.log('update attribute - ' + JSON.stringify(params));

    return new Promise((resolve, reject) => {
        cognitoIdServiceProvider.adminUpdateUserAttributes(params, function (err, data) {
            if (err) reject(err); // an error occurred
            else resolve(data); // successful response
        });
    });
}

// Export object
module.exports = new adminUpdateUser();