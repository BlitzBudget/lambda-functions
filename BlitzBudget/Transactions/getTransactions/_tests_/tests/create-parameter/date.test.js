const dateParameter = require('../../../create-parameter/date');
const mockRequest = require('../../fixtures/request/getTransactions');

describe('dateParameter: createParameter', () => {
  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = dateParameter.createParameter(event['body-json'].walletId, '2021-02');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':pk']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).toBe('Date#2021-02');
    expect(parameters.ProjectionExpression).not.toBeUndefined();
  });
});
