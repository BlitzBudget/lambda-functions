var helper = function () { };

helper.prototype.confirmForgotPasswordParameters = (event) => {
    return {
        ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g',
        /* required */
        ConfirmationCode: event['body-json'].confirmationCode,
        /* required */
        Password: event['body-json'].password,
        /* required */
        Username: event['body-json'].username,
    };
}

helper.prototype.loginParameters = (event) => {
    return {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g',
        /* required */
        AuthParameters: {
            USERNAME: event['body-json'].username,
            PASSWORD: event['body-json'].password
        }
    };
}

// Export object
module.exports = new helper();