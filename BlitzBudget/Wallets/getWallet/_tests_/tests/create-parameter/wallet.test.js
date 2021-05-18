const bankParameter = require('../../../create-parameter/wallet');
const mockRequest = require('../../fixtures/request/getWallets.json');

describe('bankParameter: createParameter', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
  });

  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = bankParameter.createParameter(event['body-json'].userId);
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.ProjectionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':userId']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).not.toBeUndefined();
  });
});
