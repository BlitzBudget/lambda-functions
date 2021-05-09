const budgetParameter = require('../../../create-parameter/budget');
const mockRequest = require('../../fixtures/request/addBudget');

describe('bankParameter: createParameter', () => {
  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = budgetParameter.createParameter(event, new Date('2021-02'));
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':pk']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).toBe('Budget#2021-02');
    expect(parameters.ProjectionExpression).not.toBeUndefined();
  });
});
