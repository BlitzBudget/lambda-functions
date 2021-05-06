const recurringTransaction = require('../../../update/recurring-transaction');
const mockRequest = require('../../fixtures/request/addScheduledTransactions.json');
const mockResponse = require('../../fixtures/response/update-response.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('With Fetch Category Data', () => {
  const event = mockRequest;
  const walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
  const recurringTransactionsId = 'sk';
  const futureTransactionCreationDate = 'date';
  test('Success', async () => {
    const response = await recurringTransaction
      .updateRecurringTransactionsData(
        walletId,
        recurringTransactionsId,
        futureTransactionCreationDate,
        documentClient,
      );
    expect(response).not.toBeUndefined();
    expect(response).toBe(mockResponse.Attributes);
  });
});
