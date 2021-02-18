const FeatureRequest = () => {};
const https = require('https');

/*
 * Send all feature request
 */
FeatureRequest.prototype.sendFeatureRequest = async (
  featureQuery,
  email,
) => new Promise((resolve, reject) => {
  console.log('Sending a feature request from ', email);
  // Send Email to BlitzBudget Support
  let message;

  const postData = JSON.stringify({
    email,
    message: featureQuery,
    subject: 'Feature request from Alexa',
  });

  const options = {
    host: 'api.blitzbudget.com',
    path: '/send-email',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length,
    },
  };

  const req = https.request(options, (res) => {
    res.setEncoding('utf8');

    // Accept incoming data asynchronously
    res.on('data', () => {
      console.log('Successfully sent a feature request from ', email);
      message = 'Thanks for the suggestion! We appreciate your contribution.';
      resolve(message);
    });
  });

  req.on('error', () => {
    console.log('There was an error sending a feature request');
    message = 'Unable to send the email at the moment. Please try again!';
    reject(message);
  });

  req.write(postData);
  req.end();
});

// Export object
module.exports = new FeatureRequest();
