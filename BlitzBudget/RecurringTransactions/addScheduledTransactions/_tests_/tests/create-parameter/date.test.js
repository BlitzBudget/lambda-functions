const dateParameter = require('../../../create-parameter/date');
const mockRequest = require('../../fixtures/request/addScheduledTransactions');

describe('dateParameter: createParameter', () => {
  const event = mockRequest;
  const walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
  test('With Data: Success', () => {
    const parameters = dateParameter.createParameter(walletId, 'sk');
    expect(parameters).not.toBeUndefined();
    expect(parameters).not.toBeUndefined();
    expect(parameters.PutRequest).not.toBeUndefined();
    expect(parameters.PutRequest.Item).not.toBeUndefined();
    expect(parameters.PutRequest.Item.pk).toBe(walletId);
    expect(parameters.PutRequest.Item.sk).toBe('sk');
    expect(parameters.PutRequest.Item.income_total).toBe(0);
    expect(parameters.PutRequest.Item.expense_total).toBe(0);
    expect(parameters.PutRequest.Item.balance).toBe(0);
    expect(parameters.PutRequest.Item.creation_date).not.toBeUndefined();
    expect(parameters.PutRequest.Item.updated_date).not.toBeUndefined();
  });
});
