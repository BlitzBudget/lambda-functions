var helper = function () { };

const userPoolId = 'eu-west-1_cjfC8qNiB';

// Build parameter
helper.prototype.buildParams = (event) => {
    let email = event['body-json'].username;
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

let isEmpty = (obj) => {
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

let isNotEmpty = (obj) => {
    return !isEmpty(obj);
}

helper.prototype.isEmpty = isEmpty;
helper.prototype.isNotEmpty = isNotEmpty;

// Export object
module.exports = new helper();