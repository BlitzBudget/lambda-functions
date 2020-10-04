const crypto = require('crypto');

const AWS = require('aws-sdk')
AWS.config.update({
    region: 'eu-west-1'
});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();


const clientId = '18he7k81dv7k6fccf7giiuo84r';
const clientSecret = 'ar8dgqr8e2jma0ojrkq5cu13bntnb624132uboirg9v6m1h4ge5';

exports.handler = async (event) => {
    let username = event['body-json'].username;

    // Authorization code
    if (isEmpty(username)) {
        throw new Error("Unable to save authorization code as the user name is empty ");
    }

    // Save Alexa Voice Code
    if (isEmpty(event['body-json'].voiceCode)) {
        throw new Error("Unable to save alexa voice code as it is empty ");
    }

    let signature = crypto.createHmac('SHA256', clientSecret)
        .update(username + clientId)
        .digest('base64')

    let params = {
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        ClientId: clientId,
        /* required */
        UserPoolId: 'eu-west-1_cjfC8qNiB',
        /* required */
        AuthParameters: {
            USERNAME: username,
            PASSWORD: event['body-json'].password,
            SECRET_HASH: signature
        }
    };

    await adminInitiateAuth(params).then(function (result) {
        console.log("The result of the initiate Auth is", result);
        event = result;
    }, function (err) {
        throw new Error("Unable to signin from cognito  " + err);
    });


    return event;
};

function adminInitiateAuth(params) {
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

function isEmpty(obj) {
    // Check if objext is a number or a boolean
    if (typeof (obj) == 'number' || typeof (obj) == 'boolean') return false;

    // Check if obj is null or undefined
    if (obj == null || obj === undefined) return true;

    // Check if the length of the obj is defined
    if (typeof (obj.length) != 'undefined') return obj.length == 0;

    // check if obj is a custom obj
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) return false;
    }

    return true;
}

function isNotEmpty(obj) {
    return !isEmpty(obj);
}
