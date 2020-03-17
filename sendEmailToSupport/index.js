// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

var aws = require('aws-sdk');
var ses = new aws.SES({region: 'eu-west-1'});

exports.handler = (event, context, callback) => {
    
     var params = {
        Destination: {
            ToAddresses: ["admin@blitzbudget.com"]
        },
        Message: {
            Body: {
                Text: { Data: event['body-json'].message
                    
                }
                
            },
            
            Subject: { Data: "Customer Support: Requesting More Information"
                
            }
        },
        Source: event['body-json'].email
    };

    
     ses.sendEmail(params, function (err, data) {
        callback(null, {err: err, data: data});
        if (err) {
            console.log(err);
            context.fail(err);
        } else {
            
            console.log(data);
            context.succeed(event);
        }
    });
};