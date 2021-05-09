const fetchParameter = require('../../../create-parameter/fetch');

describe('fetchParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameters = fetchParameter.createParameter('walletId');
    expect(parameters).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ProjectionExpression).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':walletId']).not.toBeUndefined();
  });
});
