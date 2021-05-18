const transactionParameter = require('../../../create-parameter/transaction');
const mockRequest = require('../../fixtures/request/addTransactions');

describe('transactionParameter: createParameter', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
  });

  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = transactionParameter.createParameter(event, 'sk', new Date());
    expect(parameters).not.toBeUndefined();
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.Item).not.toBeUndefined();
    expect(parameters.Item.pk).toBe(event['body-json'].walletId);
    expect(parameters.Item.sk).toBe('sk');
    expect(parameters.Item.amount).not.toBeUndefined();
    expect(parameters.Item.description).not.toBeUndefined();
    expect(parameters.Item.category).not.toBeUndefined();
    expect(parameters.Item.recurrence).not.toBeUndefined();
    expect(parameters.Item.creation_date).not.toBeUndefined();
    expect(parameters.Item.updated_date).not.toBeUndefined();
  });
});
