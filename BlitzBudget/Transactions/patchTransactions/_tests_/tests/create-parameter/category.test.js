const categoryParameter = require('../../../create-parameter/category');
const mockRequest = require('../../fixtures/request/patchTransactions');

describe('categoryParameter: createParameter', () => {
  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = categoryParameter.createParameter(event, new Date('2021-02'));
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':pk']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).toBe('Category#2021-02');
    expect(parameters.ProjectionExpression).not.toBeUndefined();
  });
});
