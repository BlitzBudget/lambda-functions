var helper = function () { };

const configuration = require('cognito-configuration');

function throwErrorIfUserIdEmpty(userId) {
    if (isEmpty(userId)) {
        throw new Error("Unable to find the user id when trying to retrieve user attributes from cognito");
    }
}

function throwErrorIfVoicecodeEmpty(event, deleteVoiceCode) {
    if (isEmpty(event['body-json'].voiceCode) && !deleteVoiceCode) {
        throw new Error("Unable to save alexa voice code as it is empty ");
    }
}

function throwErrorIfUsernameEmpty(username) {
    if (isEmpty(username)) {
        throw new Error("Unable to save authorization code as the user name is empty ");
    }
}

function createParameter(username, event, signature) {
    return {
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        ClientId: configuration.clientId,
        /* required */
        UserPoolId: 'eu-west-1_cjfC8qNiB',
        /* required */
        AuthParameters: {
            USERNAME: username,
            PASSWORD: event['body-json'].password,
            SECRET_HASH: signature
        }
    };
}

function fetchUserId(response) {
    let userId;
    for (let i = 0, len = response.UserAttributes.length; i < len; i++) {
        let userAttribute = response.UserAttributes[i];
        if (isEqual(userAttribute.Name, 'custom:financialPortfolioId')) {
            // User Id
            userId = userAttribute.Value;
        }
    }
    return userId;
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

function isEqual(obj1, obj2) {
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true;
    }
    return false;
}

function extractVariablesFromRequest(event) {
    let username = event['body-json'].username;
    let deleteVoiceCode = event['body-json'].deleteVoiceCode;
    return { username, deleteVoiceCode };
}

helper.prototype.throwErrorIfUserIdEmpty = throwErrorIfUserIdEmpty;
helper.prototype.throwErrorIfVoicecodeEmpty = throwErrorIfVoicecodeEmpty;
helper.prototype.throwErrorIfUsernameEmpty = throwErrorIfUsernameEmpty;
helper.prototype.createParameter = createParameter;
helper.prototype.fetchUserId = fetchUserId;
helper.prototype.isEmpty = isEmpty;
helper.prototype.isEqual = isEqual;
helper.prototype.extractVariablesFromRequest = extractVariablesFromRequest;
// Export object
module.exports = new helper();