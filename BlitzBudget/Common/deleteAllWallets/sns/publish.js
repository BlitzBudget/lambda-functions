const Publish = () => {};

Publish.prototype.publishToResetAccountsSNS = async (item, sns) => {
  const params = {
    Message: item,
    MessageAttributes: {
      delete_all_items_in_wallet: {
        DataType: 'String',
        StringValue: 'execute',
      },
    },
    TopicArn: 'arn:aws:sns:eu-west-1:064559090307:ResetAccountSubscriber',
  };

  const response = await sns.publish(params).promise();
  return response;
};
// Export object
module.exports = new Publish();
