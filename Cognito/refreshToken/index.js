const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    let response = {};
    let params = {
      AuthFlow:  'REFRESH_TOKEN',
      ClientId: 'l7nmpavlqp3jcfjbr237prqae', /* required */
      AuthParameters: {
          REFRESH_TOKEN: event.params.header.Authorization
      }
    };
    
    await initiateAuth(params).then(function(result) {
       response = result;
    }, function(err) {
       throw new Error("Error getting user attributes from cognito  " + err);
    });
    
    
    return response;
};

function initiateAuth(params) {
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
