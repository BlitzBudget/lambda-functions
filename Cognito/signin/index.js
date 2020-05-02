const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    let response = {};
    let params = {
      AuthFlow:  'USER_PASSWORD_AUTH',
      ClientId: 'l7nmpavlqp3jcfjbr237prqae', /* required */
      AuthParameters: {
          USERNAME: event['body-json'].username,
          PASSWORD: event['body-json'].password
      }
    };
    
    await initiateAuth(params).then(function(result) {
       response = result;
    }, function(err) {
       throw new Error("Unable to signin from cognito  " + err);
    });
    
    if(event['body-json'].checkPassword == true) {
        return response;
    }

    await getUser(response).then(function(result) {
       response.Username = result.Username;
       response.UserAttributes = result.UserAttributes;
       console.log("logged in the user " + JSON.stringify(result.Username));
    }, function(err) {
       throw new Error("Unable to signin from cognito  " + err);
    });
    
    return response;
};

function getUser(response) {
    let params = {
      AccessToken: response.AuthenticationResult.AccessToken /* required */
    };


    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.getUser(params, function(err, data) {
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
