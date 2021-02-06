const deleteHelper = require('utils/delete-helper');
const publish = require('sns/publish');

const AWS = require('aws-sdk')
AWS.config.update({
    region: 'eu-west-1'
});
// Delete User
let cognitoIdServiceProvider = new AWS.CognitoIdentityServiceProvider();

var sns = new AWS.SNS();

exports.handler = async function (event) {
    //console.log(" Events ", JSON.stringify(event));

    // Concurrently call multiple APIs and wait for the response
    // Params delete add the userName field
    let events = deleteHelper.handleDeleteAccount(event, cognitoIdServiceProvider);

    events.push(publish.resetAccountSubscriberThroughSNS(event, sns));
    let result = await Promise.all(events);
    console.log('The reset account for ' + event['body-json'].walletId + ' was ' + JSON.stringify(result));

    return Object.assign({
        result
    });
}

