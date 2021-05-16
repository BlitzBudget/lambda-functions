const budgetParameter = require('../../../create-parameter/budget');
const mockRequest = require('../../fixtures/request/getTransactions');

describe('bankParameter: createParameter', () => {
  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = budgetParameter.createParameter(event, '2021-02', '2021-03');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':walletId']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':bt1']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':bt1']).toBe('Budget#2021-02');
    expect(parameters.ExpressionAttributeValues[':bt2']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':bt2']).toBe('Budget#2021-03');
    expect(parameters.ProjectionExpression).not.toBeUndefined();
  });
});