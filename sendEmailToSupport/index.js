// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

var aws = require('aws-sdk');
var ses = new aws.SES({region: 'eu-west-1'});

exports.handler = async (event) => {
    
     var params = {
        Destination: {
            ToAddresses: ["admin@blitzbudget.com"]
        },
        Message: {
            Body: {
                Text: { 
                    Data: event['body-json'].message
                }
                
            },
            Subject: { 
                Data: event['body-json'].support
            }
        },
        Source: event['body-json'].email
    };

    
     await ses.sendEmail(params).promise();
};