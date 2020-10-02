const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    let response = {};
    let params = {
      ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g', /* required */
      Username: event['body-json'].username, /* required */
    };
    
    await forgotPassword(params).then(function(result) {
       response = result;
    }, function(err) {
       throw new Error("Unable to initialize forgot password flow from cognito  " + err);
    });
    
    
    return response;
};

function forgotPassword(params) {
    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.forgotPassword(params, function(err, data) {
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
