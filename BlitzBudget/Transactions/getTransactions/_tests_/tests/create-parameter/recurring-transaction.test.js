const recurringTransactionParameter = require('../../../create-parameter/recurring-transaction');

describe('recurringTransactionParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameters = recurringTransactionParameter.createParameter('randomValue');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':walletId']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).not.toBeUndefined();
    expect(parameters.ProjectionExpression).not.toBeUndefined();
  });
});
