const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
let cognitoIdServiceProvider = new AWS.CognitoIdentityServiceProvider();
const userPoolId = 'eu-west-1_cjfC8qNiB';
let lambda = new AWS.Lambda();
let paramsLam = {
    FunctionName: 'retrieveClaimsWithAuthHead', // the lambda function we are going to invoke
    InvocationType: 'RequestResponse',
    LogType: 'Tail'
};

exports.handler = async (event) => {
    console.log("event - " + JSON.stringify(event));
    // Waits for the first call to be satisfied
    let lamEmail = '';
    await invokeLambda(event).then(function(result) {
       lamEmail = result;
    }, function(err) {
       throw new Error("Error authenticating JWT token " + err);
    });
    
    await updateAttributes(event, lamEmail.email).then(function(result) {
       // Success function
    }, function(err) {
       throw new Error("Email cannot be updated. " + err);
    });
    
    return event;
};

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
                   resolve({ "email" : emailFromJWTToken});
                }
            });
       }); 
}

// Update User Attributes
function updateAttributes(event, email) {
    
    let params = buildParams(event, email);
    
    return new Promise((resolve, reject) => {
        cognitoIdServiceProvider.adminUpdateUserAttributes(params, function(err, data) {
          if (err) reject(err); // an error occurred
          else     resolve(data);           // successful response
        });
    });
}

// Build parameter
function buildParams(event, email) {
    let params =  {
      UserPoolId: userPoolId, /* required */
      Username: email, /* required */
    };
    
    params.UserAttributes = [];
    let attrCt = 0;
    
    // If the name attribute is present
    if(event['body-json'].name) {
        params.UserAttributes[attrCt++] = {
          Name: 'name', /* required */
          Value: event['body-json'].name
        };
    }
    
    // If the family name is present
    if(event['body-json']['family_name']) {
        params.UserAttributes[attrCt++] = {
              Name: 'family_name',
              Value: event['body-json']['family_name'],
        };
    }
    
    // If locale is present
    if(event['body-json'].locale) {
        params.UserAttributes[attrCt++] = {
              Name: 'locale',
              Value: event['body-json'].locale,
        };
    }
    
    // If currency is present
    if(event['body-json'].currency) {
         params.UserAttributes[attrCt++] = {
              Name: 'custom:currency',
              Value: event['body-json'].currency,
        };
    }
    
    return params;
}
