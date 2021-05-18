const categoryParameter = require('../../../create-parameter/fetch-category');

describe('categoryParameter: createParameter', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
  });

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
