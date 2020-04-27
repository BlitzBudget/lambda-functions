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
   events.push(deleteAllTransactions(event));
   events.push(deleteAllBudget(event));
   events.push(deleteAllAccount(event));
   
   if(event.params.querystring.deleteAccount == 'true') {
        events.push(deleteCognitoAccount(event));   
   }

    events.push(resetAccountSubscriberThroughSNS(event));   
   let result = await Promise.all(events);
   console.log('The reset account for ' + event.params.querystring.financialPortfolioId + ' was ' + JSON.stringify(result));
    
   return Object.assign({ result });
}

// Delete all transactions from an API call to EC2 function
function deleteAllTransactions(event) {

    return new Promise((resolve, reject) => {
        const options = {
            host: 'ec2-54-229-168-165.eu-west-1.compute.amazonaws.com',
            path: '/api/transactions/' + event.params.querystring.financialPortfolioId,
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            json: true
        };

        const req = http.request(options, (res) => {
          resolve('Transaction Success');
        });

        req.on('error', (e) => {
          reject(e.message);
        });

        // send the request
        req.write('');
        req.end();
    });
};

// Delete all budget from an API call to EC2 function
function deleteAllBudget(event) {
    
    return new Promise((resolve, reject) => {
        const options = {
            host: 'ec2-54-229-168-165.eu-west-1.compute.amazonaws.com',
            path: '/api/budget/?financialPortfolioId=' + event.params.querystring.financialPortfolioId,
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            json: true
        };

        const req = http.request(options, (res) => {
          resolve('Budget Success');
        });

        req.on('error', (e) => {
          reject(e.message);
        });

        // send the request
        req.write('');
        req.end();
    });
}

// Delete all account from an API call to EC2 function
function deleteAllAccount(event) {
    
    return new Promise((resolve, reject) => {
        const options = {
            host: 'ec2-54-229-168-165.eu-west-1.compute.amazonaws.com',
            path: '/api/bankaccount/?financialPortfolioId=' + event.params.querystring.financialPortfolioId,
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            json: true
        };

        const req = http.request(options, (res) => {
          resolve('Account Success');
        });

        req.on('error', (e) => {
          reject(e.message);
        });

        // send the request
        req.write('');
        req.end();
    });
}

// Delete Cognito Account
function deleteCognitoAccount(event) {
    paramsDelete.Username = event.params.querystring.userName;
    
    return new Promise((resolve, reject) => {
        cognitoIdServiceProvider.adminDeleteUser(paramsDelete, function(err, data) {
            if (err) reject(err); // an error occurred
            else     resolve('Delete Account Success');           // successful response
        });
    });
}

function resetAccountSubscriberThroughSNS(event) {
    console.log("Publishing to ResetAccountListener SNS or wallet id - " + event.params.querystring.financialPortfolioId);
    let financialPortfolioId = isNotEmpty(event.params.querystring.referenceNumber) ? event.params.querystring.referenceNumber : event.params.querystring.financialPortfolioId;
    let deleteOneWalletAttribute = isNotEmpty(event.params.querystring.referenceNumber) ? "execute" : "donotexecute";
    
    var params = {
        Message: financialPortfolioId,
        Subject: event.params.querystring.financialPortfolioId,
        MessageAttributes: {
            "delete_one_wallet": {
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