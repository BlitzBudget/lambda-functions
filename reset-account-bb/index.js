const http = require('http');
exports.handler =  async function(event, context) {
    // Concurrently call multiple APIs and wait for the response
   let events = [];
   events.push(deleteAllTransactions(event));
   events.push(deleteAllBudget(event));
   events.push(deleteAllAccount(event));
   let result = await Promise.all(events);
   return Object.assign({ result });
}

function deleteAllTransactions(event) {

    return new Promise((resolve, reject) => {
        const options = {
            host: 'REPLACE HOST INSTANCE',
            path: '/api/transactions/' + event['body-json'].financialPortfolioId,
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            json: true
        };

        const req = http.request(options, (res) => {
          resolve('Success');
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
            host: 'REPLACE HOST INSTANCE',
            path: '/api/transactions/?financialPortfolioId=' + event['body-json'].financialPortfolioId,
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            json: true
        };

        const req = http.request(options, (res) => {
          resolve('Success');
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
            host: 'REPLACE HOST INSTANCE',
            path: '/api/bankaccount/?financialPortfolioId=' + event['body-json'].financialPortfolioId,
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            json: true
        };

        const req = http.request(options, (res) => {
          resolve('Success');
        });

        req.on('error', (e) => {
          reject(e.message);
        });

        // send the request
        req.write('');
        req.end();
    });
}