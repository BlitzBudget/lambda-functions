const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    let response = {};
    let params = {
      AuthFlow:  'REFRESH_TOKEN_AUTH',
      ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g', /* required */
      AuthParameters: {
           "REFRESH_TOKEN" : event['body-json'].refreshToken
      }
    };
    
    await refreshToken(params).then(function(result) {
       response = result;
    }, function(err) {
       throw new Error("Unable to refresh token from cognito  " + err);
    });
    
    
    return response;
};

function refreshToken(params) {
    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.initiateAuth(params, function(err, data) {
          if (err) {
              console.log(err, err.stack); // an error occurred
              reject(err);
          }
          else {
              console.log(data);           // successful response
              resolve(data);
          }
        });
    });
}
