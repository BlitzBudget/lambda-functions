const categoryParameter = require('../../../create-parameter/fetch-category');

describe('categoryParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameters = categoryParameter.createParameter('pk', '2021-03');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':pk']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).toBe('Category#2021-03');
    expect(parameters.ProjectionExpression).not.toBeUndefined();
  });
});
