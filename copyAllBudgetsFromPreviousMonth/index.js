const http = require('http');
exports.handler = async (event) => {
    return await copyBudgetFromPreviousMonths();
};


// Delete all budget from an API call to EC2 function
function copyBudgetFromPreviousMonths() {
    
    return new Promise((resolve, reject) => {
        const options = {
            host: 'ec2-54-229-168-165.eu-west-1.compute.amazonaws.com',
            path: '/api/budget/copyFromPreviousMonth',
            method: 'POST',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            json: true
        };

        const req = http.request(options, (res) => {
          resolve('Budget copied from previous month');
        });

        req.on('error', (e) => {
          reject(e.message);
        });

        // send the request
        req.write('');
        req.end();
    });
}