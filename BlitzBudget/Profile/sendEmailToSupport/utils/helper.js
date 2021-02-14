var helper = function() {};

function createParameters(event) {
  return {
    Destination: {
      ToAddresses: ['admin@blitzbudget.com'],
    },
    Message: {
      Body: {
        Text: {
          Data:
            'From Address: ' +
            event['body-json'].email +
            ' Message:' +
            event['body-json'].message,
        },
      },
      Subject: {
        Data: event['body-json'].subject,
      },
    },
    Source: 'noreply@blitzbudget.com',
    ReplyToAddresses: [event['body-json'].email],
  };
}

helper.prototype.createParameters = createParameters;
// Export object
module.exports = new helper();
