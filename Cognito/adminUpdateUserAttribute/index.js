const AWS = require('aws-sdk')
AWS.config.update({
    region: 'eu-west-1'
});
let cognitoIdServiceProvider = new AWS.CognitoIdentityServiceProvider();
const userPoolId = 'eu-west-1_cjfC8qNiB';

exports.handler = async (event) => {
    console.log("event - " + JSON.stringify(event));

    await updateAttributes(event, event['body-json'].userName).then(function (result) {
        // Success function
        console.log("Successfully updated the attribute");
    }, function (err) {
        throw new Error("Unable to update the userattributes. " + err);
    });

    return event;
};


// Update User Attributes
function updateAttributes(event, email) {

    let params = buildParams(event, email);

    console.log('update attribute - ' + JSON.stringify(params));

    return new Promise((resolve, reject) => {
        cognitoIdServiceProvider.adminUpdateUserAttributes(params, function (err, data) {
            if (err) reject(err); // an error occurred
            else resolve(data); // successful response
        });
    });
}

// Build parameter
function buildParams(event, email) {
    let params = {
        UserPoolId: userPoolId,
        /* required */
        Username: email,
        /* required */
    };

    params.UserAttributes = [];
    let attrCt = 0;

    // If the name attribute is present
    if (isNotEmpty(event['body-json'].name)) {
        params.UserAttributes[attrCt++] = {
            Name: 'name',
            /* required */
            Value: event['body-json'].name
        };
    }

    // If the family name is present
    if (isNotEmpty(event['body-json']['family_name'])) {
        params.UserAttributes[attrCt++] = {
            Name: 'family_name',
            Value: event['body-json']['family_name'],
        };
    }

    // If locale is present
    if (isNotEmpty(event['body-json'].locale)) {
        params.UserAttributes[attrCt++] = {
            Name: 'locale',
            Value: event['body-json'].locale,
        };
    }

    // If currency is present
    if (isNotEmpty(event['body-json'].currency)) {
        params.UserAttributes[attrCt++] = {
            Name: 'custom:currency',
            Value: event['body-json'].currency,
        };
    }

    // If exportFileFormat is present
    if (isNotEmpty(event['body-json'].exportFileFormat)) {
        params.UserAttributes[attrCt++] = {
            Name: 'custom:exportFileFormat',
            Value: event['body-json'].exportFileFormat,
        };
    }

    return params;
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
