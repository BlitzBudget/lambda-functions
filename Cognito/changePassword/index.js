const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    let response = {};
    let params = {
      AccessToken: event['body-json'].accessToken, /* required */
      PreviousPassword: event['body-json'].previousPassword, /* required */
      ProposedPassword: event['body-json'].newPassword /* required */
    };
    
    await changePassword(params).then(function(result) {
       response = result;
    }, function(err) {
       throw new Error("Unable to change password from cognito  " + err);
    });
    
    
    return response;
};

function changePassword(params) {
    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.changePassword(params, function(err, data) {
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
