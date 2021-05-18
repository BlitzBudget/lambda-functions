const walletParameter = require('../../../create-parameter/wallet');
const mockRequest = require('../../fixtures/request/getTransactions');

describe('walletParameter: createParameter', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
  });

  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = walletParameter.createParameter(event['body-json'].walletId);
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':pk']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).toBe('Wallet#');
    expect(parameters.ProjectionExpression).not.toBeUndefined();
  });
});
