var helper = function () { };

helper.prototype.createParameters = (event) => {
    return {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g',
        AuthParameters: {
            "REFRESH_TOKEN": event['body-json'].refreshToken
        }
    };
}

// Export object
module.exports = new helper();
