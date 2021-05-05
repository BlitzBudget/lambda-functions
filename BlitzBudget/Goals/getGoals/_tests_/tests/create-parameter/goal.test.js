const goalParameter = require('../../../create-parameter/goal');
const mockRequest = require('../../fixtures/request/getGoals.json');

describe('goalParameter: createParameter', () => {
  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = goalParameter.createParameter(event['body-json'].walletId);
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':walletId']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).toBe('Goal#');
    expect(parameters.ProjectionExpression).not.toBeUndefined();
  });
});
