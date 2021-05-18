const transactionParameter = require('../../../create-parameter/transaction');

describe('TransactionParameter: createParameter', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
  });

  test('With Data: Success', () => {
    const parameters = transactionParameter.createParameter('randomValue', 'startsWithDate', 'endsWithDate');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':pk']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':bt1']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':bt1']).toBe('Transaction#startsWithDate');
    expect(parameters.ExpressionAttributeValues[':bt2']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':bt2']).toBe('Transaction#endsWithDate');
    expect(parameters.ProjectionExpression).not.toBeUndefined();
  });
});
