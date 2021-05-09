const transactionParameter = require('../../../create-parameter/transaction');
const mockRequest = require('../../fixtures/request/getBudgets');

describe('transactionParameter: createParameter', () => {
  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = transactionParameter.createParameter(event['body-json'].walletId, '2021-02', '2021-03');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':pk']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':bt1']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':bt1']).toBe('Transaction#2021-02');
    expect(parameters.ExpressionAttributeValues[':bt2']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':bt2']).toBe('Transaction#2021-03');
    expect(parameters.ProjectionExpression).not.toBeUndefined();
  });
});
