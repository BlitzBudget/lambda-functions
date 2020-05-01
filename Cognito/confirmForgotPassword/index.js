const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    let response = {};
    let params = {
      ClientId: 'l7nmpavlqp3jcfjbr237prqae', /* required */
      ConfirmationCode: event['body-json'].confirmationCode, /* required */
      Password: event['body-json'].password, /* required */
      Username: event['body-json'].userName, /* required */
    };
    
    await confirmForgotPassword(params).then(function(result) {
       response = result;
    }, function(err) {
       throw new Error("Error getting user attributes from cognito  " + err);
    });
    
    
    return response;
};

function confirmForgotPassword(params) {
    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.confirmForgotPassword(params, function(err, data) {
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
