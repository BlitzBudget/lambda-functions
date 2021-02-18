const Publish = () => {};

const helper = require('../utils/helper');

function resetAccountSubscriberThroughSNS(event, sns) {
  console.log(
    `Publishing to ResetAccountListener SNS or wallet id - ${
      event['body-json'].walletId}`,
  );
  const deleteOneWalletAttribute = helper.isNotEmpty(
    event['body-json'].referenceNumber,
  )
    ? 'execute'
    : 'donotexecute';

  function createParameters() {
    return {
      Message: event['body-json'].walletId,
      Subject: event['body-json'].referenceNumber,
      MessageAttributes: {
        delete_one_wallet: {
          DataType: 'String',
          StringValue: deleteOneWalletAttribute,
        },
      },
      TopicArn: 'arn:aws:sns:eu-west-1:064559090307:ResetAccountSubscriber',
    };
  }

  const params = createParameters();

  return new Promise((resolve, reject) => {
    sns.publish(params, (err) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        resolve('Reset account to SNS published');
      }
    });
  });
}

Publish.prototype.resetAccountSubscriberThroughSNS = resetAccountSubscriberThroughSNS;
// Export object
module.exports = new Publish();
