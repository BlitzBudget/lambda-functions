const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    let response = {};
    var params = {
      AccessToken: event['body-json'].accessToken /* required */
    };
    
    await deleteUser(params).then(function(result) {
       response = result;
    }, function(err) {
       throw new Error("Unable to delete user from cognito  " + err);
    });
    
    return response;
};

function deleteUser(params) {
    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.deleteUser(params, function(err, data) {
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