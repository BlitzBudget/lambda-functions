const transactionParameter = require('../../../create-parameter/transaction');

describe('transactionParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameters = transactionParameter.createParameter('walletId', '2021-03');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':pk']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).toBe('Transaction#2021-03');
    expect(parameters.ProjectionExpression).not.toBeUndefined();
  });
});
