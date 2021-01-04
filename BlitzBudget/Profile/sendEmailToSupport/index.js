// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

var aws = require('aws-sdk');
var ses = new aws.SES({
    region: 'eu-west-1'
});

exports.handler = async (event) => {
    console.log("The from email address is ", event['body-json'].email, " The subject is ", event['body-json'].subject);
    var params = {
        Destination: {
            ToAddresses: ["admin@blitzbudget.com"]
        },
        Message: {
            Body: {
                Text: {
                    Data: 'From Address: ' + event['body-json'].email + ' Message:' + event['body-json'].message
                }

            },
            Subject: {
                Data: event['body-json'].subject
            }
        },
        Source: "noreply@blitzbudget.com",
        ReplyToAddresses: [
            event['body-json'].email,
        ],
    };


    await ses.sendEmail(params).promise().then(
        function (data) {
            console.log(data.MessageId);
        }).catch(
        function (err) {
            console.error("Unbable to send the email", err, err.stack);
            throw new Error("Unable to send the request email. Please try again later!");
        });
};
