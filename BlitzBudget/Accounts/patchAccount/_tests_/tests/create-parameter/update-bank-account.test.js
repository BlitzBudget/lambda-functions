const updateBankParameter = require('../../../create-parameter/update-bank-account');
const mockRequest = require('../../fixtures/request/patchAccount');

describe('updateBankParameter: createParameter', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
  });

  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = updateBankParameter.createParameter(event);
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.Key).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.UpdateExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':u']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':v0']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':v2']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':v1']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeNames['#update']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeNames['#variable0']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeNames['#variable1']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeNames['#variable2']).not.toBeUndefined();
  });
});
