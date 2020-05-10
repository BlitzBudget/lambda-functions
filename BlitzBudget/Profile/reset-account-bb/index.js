const http = require('http');
const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
// Delete User
let cognitoIdServiceProvider = new AWS.CognitoIdentityServiceProvider();
const userPoolId = 'eu-west-1_cjfC8qNiB';
let paramsDelete = {
    UserPoolId: userPoolId, /* required */
};

var sns = new AWS.SNS();

exports.handler =  async function(event) {
   
   // Concurrently call multiple APIs and wait for the response 
   let events = [];
   
   if(event['body-json'].deleteAccount == 'true') {
        events.push(deleteCognitoAccount(event));   
   }

   events.push(resetAccountSubscriberThroughSNS(event));   
   let result = await Promise.all(events);
   console.log('The reset account for ' + event['body-json'].walletId + ' was ' + JSON.stringify(result));
    
   return Object.assign({ result });
}

// Delete Cognito Account
function deleteCognitoAccount(event) {
    paramsDelete.Username = event['body-json'].userName;
    
    return new Promise((resolve, reject) => {
        cognitoIdServiceProvider.adminDeleteUser(paramsDelete, function(err, data) {
            if (err) reject(err); // an error occurred
            else     resolve('Delete Account Success');           // successful response
        });
    });
}

function resetAccountSubscriberThroughSNS(event) {
    console.log("Publishing to ResetAccountListener SNS or wallet id - " + event['body-json'].walletId);
    let walletId = isNotEmpty(event['body-json'].referenceNumber) ? event['body-json'].referenceNumber : event['body-json'].walletId;
    let deleteOneWalletAttribute = isNotEmpty(event['body-json'].referenceNumber) ? "execute" : "donotexecute";
    
    var params = {
        Message: walletId,
        Subject: event['body-json'].walletId,
        MessageAttributes: {
            "delete_one_wallet": {
                "DataType": "String",
                "StringValue": deleteOneWalletAttribute
            },
            "delete_all_items_in_wallet": {
                "DataType": "String",
                "StringValue": deleteOneWalletAttribute
            }
        },
        TopicArn: 'arn:aws:sns:eu-west-1:064559090307:ResetAccountSubscriber'
    };
    
    return new Promise((resolve, reject) => {
        sns.publish(params,  function(err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                resolve( "Reset account to SNS published");
            }
        }); 
    });
}

function  isEmpty(obj) {
  // Check if objext is a number or a boolean
  if(typeof(obj) == 'number' || typeof(obj) == 'boolean') return false; 
  
  // Check if obj is null or undefined
  if (obj == null || obj === undefined) return true;
  
  // Check if the length of the obj is defined
  if(typeof(obj.length) != 'undefined') return obj.length == 0;
   
  // check if obj is a custom obj
  for(let key in obj) {
        if(obj.hasOwnProperty(key))return false;
    }

  return true;
}

function isNotEmpty(obj) {
    return !isEmpty(obj)
}