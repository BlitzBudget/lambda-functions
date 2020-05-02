const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    let accepLan = JSON.stringify(event.params.header['Accept-Language']);
    let response = {};
    let params = {
      ClientId: 'l7nmpavlqp3jcfjbr237prqae', /* required */
      Password: event['body-json'].password, /* required */
      Username: event['body-json'].username, /* required */
      UserAttributes: [
        {
          Name: 'email', /* required */
          Value: event['body-json'].username
        },
        {
          Name: 'name', /* required */
          Value: event['body-json'].firstname
        },
        {
          Name: 'family_name', /* required */
          Value: event['body-json'].lastname
        },
        {
          Name: 'locale', /* required */
          Value: accepLan.substring(1,6)
        },
        {
          Name: 'custom:financialPortfolioId', /* required */
          Value: "User#" + new Date().toISOString()
        },
        {
          Name: 'custom:exportFileFormat', /* required */
          Value: 'XLS'
        }
        /* more items */
      ],
    };
    
    await signUp(params).then(function(result) {
       response = result;
    }, function(err) {
       throw new Error("Unable to signin from cognito  " + err);
    });
    
    
    return response;
};

function signUp(params) {
    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.signUp(params, function(err, data) {
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