// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

var aws = require('aws-sdk');
var ses = new aws.SES({region: 'eu-west-1'});

exports.handler =  async function(event, context) {

    // Send post authentication data to Cloudwatch logs
    if(event.request.newDeviceUsed) {
        let html = '<div style="margin:0;padding:0" bgcolor="#FFFFFF"> <table width="100%" height="100%" style="min-width:348px" border="0" cellspacing="0" cellpadding="0" lang="en"> <tbody> <tr height="32" style="height:32px"> <td></td> </tr> <tr align="center"> <td> <table border="0" cellspacing="0" cellpadding="0" style="padding-bottom:20px;max-width:516px;min-width:220px"> <tbody> <tr> <td width="8" style="width:8px"></td> <td> <div style="border-style:solid;border-width:thin;border-color:#dadce0;border-radius:8px;padding:40px 20px" align="center"> <img src="https://app.blitzbudget.com/img/business-name/business-name-logo.png" width="60" height="60" aria-hidden="true" style="margin-bottom:16px" alt="Blitz Budget"> <div style="font-family:\'Google Sans\',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;border-bottom:thin solid #dadce0;color:rgba(0,0,0,0.87);line-height:32px;padding-bottom:24px;text-align:center;word-break:break-word"> <div style="font-size:24px"> <span class="il">New</span> <span class="il">device</span> signed in&nbsp;to </div> <table align="center" style="margin-top:8px"> <tbody> <tr style="line-height:normal"> <td align="right" style="padding-right:8px"> <img width="20" height="20" style="width:20px;height:20px;vertical-align:sub;border-radius:50%" src="https://app.blitzbudget.com/img/dummy/avatarProfile.jpg" alt=""> </td> <td> <a style="font-family:\'Google Sans\',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.87);font-size:14px;line-height:20px">' + event.userName + '</a> </td> </tr> </tbody> </table> </div> <div style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:14px;color:rgba(0,0,0,0.87);line-height:20px;padding-top:20px;text-align:center"> Your Blitz Budget account was just signed in to from a <span class="il">new</span> <span class="il">device</span>. You\'re getting this email to make sure that it was you. <div style="padding-top:32px;text-align:center"> <a href="https://app.blitzbudget.com/home?email=' + event.userName + '&page=settingsPage&tab=devices" style="font-family:\'Google Sans\',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;line-height:16px;color:#ffffff;font-weight:400;text-decoration:none;font-size:14px;display:inline-block;padding:10px 24px;background-color:#4184f3;border-radius:5px;min-width:90px" target="_blank" data-saferedirecturl="https://app.blitzbudget.com/home?email=' + event.userName +'&page=settingsPage&tab=devices">It wasn\'t me</a> </div> </div> </div> <div style="text-align:left"><div style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.54);font-size:11px;line-height:18px;padding-top:12px;text-align:center"> <div>You received this email to let you know about important changes to your Blitz Budget account. </div> <div style="direction:ltr">© 2019 Blitz Budget, <a style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.54);font-size:11px;line-height:18px;padding-top:12px;text-align:center">India</a> </div> </div> </div> </td> <td width="8" style="width:8px"></td> </tr> </tbody> </table> </td> </tr> <tr height="32" style="height:32px"> <td></td> </tr> </tbody> </table> </div>';
            
        var params = {
            Destination: {
                ToAddresses: [event.userName]
            },
            Message: {
                Body: {
                    Html: { 
                        Data: html
                    }
                    
                },
                
                Subject: { Data: "Security alert"
                    
                }
            },
            Source: "Blitz Budget<noreply@blitzbudget.com>"
        };
    
        
        const response = await ses.sendEmail(params).promise();
        console.log(response);
    } 
    
    // Return to Amazon Cognito
    return event;   
};