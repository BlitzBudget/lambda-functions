const Publish = () => {};

const snsParameter = require('../create-parameter/sns');

Publish.prototype.publishToResetAccountsSNS = async (item, sns) => {
  const params = snsParameter.createParameter(item);

  const response = await sns.publish(params).promise();
  return response;
};
// Export object
module.exports = new Publish();
