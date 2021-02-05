var helper = function () { };

helper.prototype.changePasswordParameters = (accessToken, previousPassword, newPassword) => {
    return {
        AccessToken: accessToken,
        PreviousPassword: previousPassword,
        ProposedPassword: newPassword
    };
}

// Export object
module.exports = new helper();