const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    let response = {};
    let params = {
      ClientId: 'l7nmpavlqp3jcfjbr237prqae', /* required */
      Username: event['body-json'].username, /* required */
    };
    
    await resendConfirmationCode(params).then(function(result) {
       response = result;
    }, function(err) {
       throw new Error("Unable to confirm signup from cognito  " + err);
    });
    
    return response;
};

function resendConfirmationCode(params) {
    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.resendConfirmationCode(params, function(err, data) {  
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