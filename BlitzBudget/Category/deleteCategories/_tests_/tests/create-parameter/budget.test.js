const budgetParameter = require('../../../create-parameter/budget');

describe('budgetParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameters = budgetParameter.createParameter('walletId', '2021-03');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':pk']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).toBe('Budget#2021-03');
    expect(parameters.ProjectionExpression).not.toBeUndefined();
  });
});
