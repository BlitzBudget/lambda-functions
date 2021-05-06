const snsParameter = require('../../../create-parameter/sns');
const mockRequest = require('../../fixtures/request/deleteOneWallet.json');

describe('snsParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameters = snsParameter.createParameter('donotexecute', mockRequest);
    expect(parameters).not.toBeUndefined();
    expect(parameters.Message).not.toBeUndefined();
    expect(parameters.MessageAttributes).not.toBeUndefined();
    expect(parameters.MessageAttributes.delete_one_wallet).not.toBeUndefined();
    expect(parameters.MessageAttributes.delete_one_wallet.DataType).not.toBeUndefined();
    expect(parameters.MessageAttributes.delete_one_wallet.StringValue).not.toBeUndefined();
    expect(parameters.TopicArn).not.toBeUndefined();
  });
});
