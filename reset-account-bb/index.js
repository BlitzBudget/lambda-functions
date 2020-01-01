const http = require('http');
const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
let lambda = new AWS.Lambda();
let params = {
    FunctionName: 'retrieveClaimsWithAuthHead', // the lambda function we are going to invoke
    InvocationType: 'RequestResponse',
    LogType: 'Tail'
};
let errorRespUA = "Mismatch of Financial Portfolio Id to reset the account";

exports.handler =  async function(event) {
   let invLamRes = '';
   // Waits for the first call to be satisfied
   await invokeLambda(event).then(function(result) {
       console.log("The financial portfolio id matches.");
       invLamRes = result;
    }, function(err) {
        console.log(err);
        return err;
    });
    
    if(invLamRes == '') {
        throw new Error(errorRespUA);
    }
   
   // Concurrently call multiple APIs and wait for the response 
   let events = [];
   events.push(deleteAllTransactions(event));
   events.push(deleteAllBudget(event));
   events.push(deleteAllAccount(event));
   let result = await Promise.all(events);
   console.log('The reset account for ' + event.params.querystring.financialPortfolioId + ' was ' + JSON.stringify(result));
    
   return Object.assign({ result });
}

// Invoke Lambda retrieveClaim function
function invokeLambda(event) {
    // Authorization 
      params.Payload = JSON.stringify({ "Authorization" :  event.params.header.Authorization});
    
       return new Promise((resolve, reject) => {
           lambda.invoke(params, function(err, data) {
               let payLoad = JSON.parse(data.Payload);
                if (err || payLoad.status == '401') {
                  console.log("Error occurred while authenticating JWT Token - " + data.Payload);
                  reject(err);
                } else {
                  let ftpFromJWTToken = payLoad['custom:financialPortfolioId'];
                  let userFPI = event.params.querystring.financialPortfolioId;
                  if(ftpFromJWTToken == userFPI) {
                      resolve({ "financialPortfolioId" : ftpFromJWTToken});
                  } else {
                      console.log(" Entered financialPortfolioId - " + userFPI + ' is not equal to JWT Token financialPortfolioId - ' + ftpFromJWTToken + ' ');
                      reject("financialPortfolioId mismatch");
                  }
                }
            });
       }); 
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