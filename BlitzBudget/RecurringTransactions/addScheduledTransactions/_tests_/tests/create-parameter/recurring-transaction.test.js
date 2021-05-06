const recurringTransactionParameter = require('../../../create-parameter/recurring-transaction');
const mockRequest = require('../../fixtures/request/addScheduledTransactions');
const constants = require('../../../constants/constant');

describe('recurringTransactionParameter: createParameter', () => {
  const event = mockRequest;
  const walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
  test('With Data: Success', () => {
    const parameters = recurringTransactionParameter.createParameter(walletId, 'sk', '2021-03-15');
    expect(parameters).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.Key).not.toBeUndefined();
    expect(parameters.Key.pk).toBe(walletId);
    expect(parameters.Key.sk).toBe('sk');
    expect(parameters.ReturnValues).toBe('ALL_NEW');
    expect(parameters.TableName).toBe(constants.TABLE_NAME);
    expect(parameters.UpdateExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':u']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':ns']).toBe('2021-03-15');
  });
});
