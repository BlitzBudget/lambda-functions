module.exports.createParameter = (item) => ({
  Message: item,
  MessageAttributes: {
    delete_all_items_in_wallet: {
      DataType: 'String',
      StringValue: 'execute',
    },
  },
  TopicArn: 'arn:aws:sns:eu-west-1:064559090307:ResetAccountSubscriber',
});
