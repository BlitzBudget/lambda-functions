const http = require('http');
exports.handler =  async function(event, context) {
   // Concurrently call multiple APIs and wait for the response
   let events = [];
   events.push(deleteAllTransactions(event));
   events.push(deleteAllBudget(event));
   events.push(deleteAllAccount(event));
   let result = await Promise.all(events);
   console.log('The reset account for ' + event.params.querystring.financialPortfolioId + ' was ' + JSON.stringify(result));
   return Object.assign({ result });
}

function deleteAllTransactions(event) {

    return new Promise((resolve, reject) => {
        const options = {
            host: 'ec2-****************.compute.amazonaws.com',
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

function deleteAllBudget(event) {
    
    return new Promise((resolve, reject) => {
        const options = {
            host: 'ec2-****************.compute.amazonaws.com',
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

function deleteAllAccount(event) {
    
    return new Promise((resolve, reject) => {
        const options = {
            host: 'ec2-****************.compute.amazonaws.com',
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