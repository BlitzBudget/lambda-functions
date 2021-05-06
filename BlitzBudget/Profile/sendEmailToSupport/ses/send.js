function SesSend() {}

// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const aws = require('aws-sdk');
const constants = require('../constants/constant');

const ses = new aws.SES({
  region: constants.EU_WEST_ONE,
});

async function sendEmail(params) {
  await ses
    .sendEmail(params)
    .promise()
    .then((data) => {
      console.log(data.MessageId);
    })
    .catch((err) => {
      console.error('Unbable to send the email', err, err.stack);
      throw new Error(
        'Unable to send the request email. Please try again later!',
      );
    });
}

SesSend.prototype.sendEmail = sendEmail;
// Export object
module.exports = new SesSend();
