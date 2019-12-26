const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});

function getItem(cty, event, context) {
        // Create the DynamoDB service object
        var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
        
        var ddbParams = {
          AttributesToGet: [
             "currency"
          ],
          TableName: 'cf-country-to-currency',
          Key: {
                country: {
                    S: cty
                }
          }
        };
        
        // Call DynamoDB to read the item from the table
        ddb.getItem(ddbParams, function(err, data) {
          if (err) {
            console.log("Error ", err);
            context.done(err, event);
          } else {
            console.log("Success ", data.Item.currency.S);
            return updateCogItem(data.Item.currency.S, event, context);
          }
        });
}

function updateCogItem(currency, event, context) {
       let accepLan = JSON.stringify(event.params.header['Accept-Language']);
        const params = {
            UserAttributes: [
              {
                  Name: 'locale',
                  Value: accepLan.substring(1,6),
              },
              {
                  Name: 'custom:currency',
                  Value: currency,
              }
            ],
            UserPoolId: 'eu-west-1_cjfC8qNiB',
            Username: event['body-json'].userName,
        };
        var cognitoIdServiceProvider = new AWS.CognitoIdentityServiceProvider();
        cognitoIdServiceProvider.adminUpdateUserAttributes(params, function(err, data) {
            if (err) context.done(err, event); // an error occurred
            else {
                event['body-json'].currency = currency; // Add currency to the reponse event
                event['body-json'].locale = accepLan.substring(1,6); // Add locale to the response event
                context.done(null, event); // successful response
            }
        });
}

exports.handler = function async(event, context) {
    
        return getItem(event.params.header['CloudFront-Viewer-Country'], event, context);
};
