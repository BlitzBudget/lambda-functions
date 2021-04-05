module.exports.createParameter = (deleteOneWalletAttribute, event) => ({
  Message: event['body-json'].walletId,
  Subject: event['body-json'].referenceNumber,
  MessageAttributes: {
    delete_one_wallet: {
      DataType: 'String',
      StringValue: deleteOneWalletAttribute,
    },
  },
  TopicArn: 'arn:aws:sns:eu-west-1:064559090307:ResetAccountSubscriber',
});
