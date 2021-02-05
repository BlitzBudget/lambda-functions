const helper = require('helper');
const refreshToken = require('refresh-token');

exports.handler = async (event) => {
    let response = {};
    let params = helper.createParameters(event);
    
    await refreshToken.handleRefreshToken(params).then(function(result) {
       response = result;
    }, function(err) {
       throw new Error("Unable to refresh token from cognito  " + err);
    });
    
    
    return response;
};