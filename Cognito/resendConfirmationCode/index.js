const helper = require('helper');
const resendConfirmation = require('resend-confirmation');

exports.handler = async (event) => {
    let response = {};
    let params = helper.createParameter(event);
    
    response = await handleResendConfirmationCode(params, response);
    
    return response;
};

async function handleResendConfirmationCode(params, response) {
    await resendConfirmation.resendConfirmationCode(params).then(function (result) {
        response = result;
    }, function (err) {
        throw new Error("Unable to confirm signup from cognito  " + err);
    });
    return response;
}

