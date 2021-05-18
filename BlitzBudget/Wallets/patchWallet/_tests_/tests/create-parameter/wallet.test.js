const updateWalletParameter = require('../../../create-parameter/wallet');
const mockRequest = require('../../fixtures/request/patchWallet');

describe('updateWalletParameter: createParameter', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
  });

  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = updateWalletParameter.createParameter(event, 'ue', 'ean', 'eav');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.Key).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.UpdateExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.ExpressionAttributeNames).not.toBeUndefined();
  });
});
