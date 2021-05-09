function Publish() {}

const util = require('../utils/util');
const snsParameter = require('../create-parameter/sns');

async function resetAccountSubscriberThroughSNS(event, sns) {
  console.log(
    `Publishing to ResetAccountListener SNS or wallet id - ${
      event['body-json'].walletId}`,
  );
  const deleteOneWalletAttribute = util.isNotEmpty(
    event['body-json'].referenceNumber,
  )
    ? 'execute'
    : 'donotexecute';

  const params = snsParameter.createParameter(deleteOneWalletAttribute, event);

  const response = await sns.publish(params).promise();
  return response;
}

Publish.prototype.resetAccountSubscriberThroughSNS = resetAccountSubscriberThroughSNS;
// Export object
module.exports = new Publish();
