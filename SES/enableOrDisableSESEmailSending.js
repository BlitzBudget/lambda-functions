const aws = require('aws-sdk');

// Create a new SES object.
const ses = new aws.SES();

// Specify the parameters for this operation. In this case, there is only one
// parameter to pass: the Enabled parameter, with a value of false
// (Enabled = false disables email sending, Enabled = true enables it).
const params = {
  Enabled: false,
};

exports.handler = () => {
  // Pause sending for your entire SES account
  ses.updateAccountSendingEnabled(params, (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(data);
    }
  });
};
