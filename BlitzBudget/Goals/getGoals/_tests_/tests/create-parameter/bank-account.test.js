const bankParameter = require('../../../create-parameter/bank-account');
const mockRequest = require('../../fixtures/request/getGoals.json');

describe('bankParameter: createParameter', () => {
  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = bankParameter.createParameter(event['body-json'].walletId);
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':pk']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).toBe('BankAccount#');
    expect(parameters.ProjectionExpression).not.toBeUndefined();
  });
});
