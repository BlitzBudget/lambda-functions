const transactionParameter = require('../../../create-parameter/transaction');

describe('TransactionParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameters = transactionParameter.createParameter('randomValue');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':pk']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).not.toBeUndefined();
    expect(parameters.ProjectionExpression).not.toBeUndefined();
  });
});
