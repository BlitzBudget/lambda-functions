const snsParameter = require('../../../create-parameter/sns');

describe('snsParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameters = snsParameter.createParameter('walletId');
    expect(parameters).not.toBeUndefined();
    expect(parameters.Message).not.toBeUndefined();
    expect(parameters.MessageAttributes).not.toBeUndefined();
    expect(parameters.MessageAttributes.delete_all_items_in_wallet).not.toBeUndefined();
    expect(parameters.MessageAttributes.delete_all_items_in_wallet.DataType).not.toBeUndefined();
    expect(parameters.MessageAttributes.delete_all_items_in_wallet.StringValue).not.toBeUndefined();
    expect(parameters.TopicArn).not.toBeUndefined();
  });
});
