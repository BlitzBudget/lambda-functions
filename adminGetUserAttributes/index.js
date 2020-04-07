const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
let cognitoIdServiceProvider = new AWS.CognitoIdentityServiceProvider();
const userPoolId = 'eu-west-1_cjfC8qNiB';
let params = {
    UserPoolId: userPoolId, /* required */
    /*Limit: 'NUMBER_VALUE',*/
    /*PaginationToken: 'STRING_VALUE'*/
};

exports.handler = async (event) => {
   let userAttr = '';
   
   params.Username = event.params.querystring.userName; /* required */
   await getUser(params).then(function(result) {
       userAttr = result;
    }, function(err) {
       throw new Error("Error getting user attributes from cognito  " + err);
    });
   
    return userAttr;
};

// Get User Attributes
function getUser(params) {
     
  return new Promise((resolve, reject) => {
       cognitoIdServiceProvider.adminGetUser(params, function(err, data) {
          if (err) reject(err); // an error occurred
          else     resolve(data);           // successful response
        });
  });
}


