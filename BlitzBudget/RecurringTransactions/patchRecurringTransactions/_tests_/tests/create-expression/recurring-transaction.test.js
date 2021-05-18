const recurringTransactionExpression = require('../../../create-expression/recurring-transaction');
const mockRequest = require('../../fixtures/request/patchRecurringTransactions');

describe('recurringTransactionExpression: createExpression', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
  });

  mockRequest['body-json'].categoryName = 'random';
  const event = mockRequest;

  test('With Data: Success', () => {
    const parameters = recurringTransactionExpression.createExpression(event);
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.UpdateExpression).not.toBeUndefined();
    expect(parameters.Key).not.toBeUndefined();
    expect(parameters.Key.pk).not.toBeUndefined();
    expect(parameters.Key.sk).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.ExpressionAttributeNames).not.toBeUndefined();
    expect(parameters.ReturnValues).not.toBeUndefined();
  });

  test('Without Data: Success', () => {
    event['body-json'] = undefined;
    const parameters = recurringTransactionExpression.createExpression(event);
    expect(parameters).toBeUndefined();
  });

  test('Without proper Data: Success', () => {
    event['body-json'] = {
      walletId: 'Wallet#2020-04-13',
    };
    const parameters = recurringTransactionExpression.createExpression(event);
    expect(parameters).toBeUndefined();
  });
});
