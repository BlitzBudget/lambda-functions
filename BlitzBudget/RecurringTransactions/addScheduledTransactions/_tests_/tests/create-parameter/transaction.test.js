const transactionParameter = require('../../../create-parameter/transaction');
const mockRequest = require('../../fixtures/request/addScheduledTransactions');

describe('transactionParameter: createParameter', () => {
  const event = mockRequest;
  const walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
  const recurrence = event.Records[0].Sns.MessageAttributes.recurrence.Value;
  const amount = event.Records[0].Sns.MessageAttributes.amount.Value;
  const description = event.Records[0].Sns.MessageAttributes.description.Value;
  const category = event.Records[0].Sns.MessageAttributes.category.Value;
  const account = event.Records[0].Sns.MessageAttributes.account.Value;
  const tags = event.Records[0].Sns.MessageAttributes.tags.Value;
  test('With Data: Success', () => {
    const parameters = transactionParameter.createParameter(
      walletId,
      'sk',
      recurrence,
      amount,
      description,
      category,
      account,
      tags,
      'dateMeantFor',
      new Date(),
    );
    expect(parameters).not.toBeUndefined();
    expect(parameters).not.toBeUndefined();
    expect(parameters.PutRequest).not.toBeUndefined();
    expect(parameters.PutRequest.Item).not.toBeUndefined();
    expect(parameters.PutRequest.Item.pk).toBe(walletId);
    expect(parameters.PutRequest.Item.sk).toBe('sk');
    expect(parameters.PutRequest.Item.account).toBe(account);
    expect(parameters.PutRequest.Item.amount).toBe(amount);
    expect(parameters.PutRequest.Item.category).toBe(category);
    expect(parameters.PutRequest.Item.creation_date).not.toBeUndefined();
    expect(parameters.PutRequest.Item.date_meant_for).toBe('dateMeantFor');
    expect(parameters.PutRequest.Item.description).toBe(description);
    expect(parameters.PutRequest.Item.recurrence).toBe(recurrence);
    expect(parameters.PutRequest.Item.tags).toBe(tags);
  });
});
