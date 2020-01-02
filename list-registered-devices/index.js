const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
let cognitoIdServiceProvider = new AWS.CognitoIdentityServiceProvider();
const userPoolId = 'eu-west-1_cjfC8qNiB';
let params = {
    UserPoolId: userPoolId, /* required */
    /*Limit: 'NUMBER_VALUE',*/
    /*PaginationToken: 'STRING_VALUE'*/
};
let lambda = new AWS.Lambda();
let paramsLam = {
    FunctionName: 'retrieveClaimsWithAuthHead', // the lambda function we are going to invoke
    InvocationType: 'RequestResponse',
    LogType: 'Tail'
};

exports.handler = async (event) => {
   let devices = '';
   // Waits for the first call to be satisfied
   let lamEmail = '';
   await invokeLambda(event).then(function(result) {
       console.log("The Email ID matches.");
       lamEmail = result;
   }, function(err) {
       throw new Error("Error authenticating JWT token and matching the given Email ID's " + err);
   });
   
   // If the result from retrieve claims is empty
   if(lamEmail == '') {
       throw new Error("Error authenticating JWT token and matching the given Email ID's ");
   }
   
   await listDevices(params, event).then(function(result) {
       devices = result;
    }, function(err) {
       throw new Error("Error listing devices from cognito  " + err);
    });
   
    return devices;
};

function listDevices(params, event) {
  params.Username = event.params.querystring.userName; /* required */
     
  return new Promise((resolve, reject) => {
       cognitoIdServiceProvider.adminListDevices(params, function(err, data) {
          if (err) reject(err); // an error occurred
          else     resolve(data);           // successful response
        });
  });
}


// Invoke Lambda retrieveClaim function
function invokeLambda(event) {
    // Authorization 
      paramsLam.Payload = JSON.stringify({ "Authorization" :  event.params.header.Authorization});
    
      return new Promise((resolve, reject) => {
           lambda.invoke(paramsLam, function(err, data) {
               
                if (err) {
                  console.log("Error occurred while authenticating JWT Token - " + err);
                  reject(err);
                } else if(data.hasOwnProperty('Payload')) {
                   let payLoad = JSON.parse(data.Payload);
                   // Thorw 401 is the status is 401
                   if(payLoad.status == '401') {
                     console.log("Error occurred while authenticating JWT Token - " + data.Payload);
                     reject(data.Payload);
                   }
                   
                   let emailFromJWTToken = JSON.parse(data.Payload).email;
                   if(emailFromJWTToken == event.params.querystring.userName) {
                      resolve({ "email" : emailFromJWTToken});
                   } else {
                      console.log(" Entered Email address - " + event['body-json'].userName + ' is not equal to JWT Token Email - ' + emailFromJWTToken);
                      reject("email address mismatch");
                   }
                }
            });
       }); 
}