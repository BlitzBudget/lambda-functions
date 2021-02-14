var sesSend = function () {};

// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

var aws = require('aws-sdk');
var ses = new aws.SES({
  region: 'eu-west-1',
});

async function sendEmail(params) {
  await ses
    .sendEmail(params)
    .promise()
    .then(function (data) {
      console.log(data.MessageId);
    })
    .catch(function (err) {
      console.error('Unbable to send the email', err, err.stack);
      throw new Error(
        'Unable to send the request email. Please try again later!'
      );
    });
}

sesSend.prototype.sendEmail = sendEmail;
// Export object
module.exports = new sesSend();
