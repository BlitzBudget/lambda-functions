var featureRequest = function () { };
var https = require('https');

/*
* Send all feature request
*/
featureRequest.prototype.sendFeatureRequest = async function(featureQuery, email) {
    return new Promise((resolve, reject) => {
        console.log("Sending a feature request from ", email);
        // Send Email to BlitzBudget Support
        let message;
        
        var postData = JSON.stringify({
            "email" : email,
    		"message" : featureQuery,
    		"subject" : 'Feature request from Alexa'
        });
        
        const options = {
            host: 'api.blitzbudget.com',
            path: '/send-email',
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Content-Length': postData.length
            }
        };
    
        var req = https.request(options, res => {
            res.setEncoding('utf8');
            var responseString = "";
            
            // Accept incoming data asynchronously
            res.on('data', chunk => {
                console.log("Successfully sent a feature request from ", email);
                message = "Thanks for the suggestion! We appreciate your contribution.";
                resolve(message);
            });
        });
        
        req.on('error', (e) => {
           console.log("There was an error sending a feature request");
           message = "Unable to send the email at the moment. Please try again!";
           reject(message);
        });
        
        req.write(postData);
        req.end();
        
    });
}

// Export object
module.exports = new featureRequest();