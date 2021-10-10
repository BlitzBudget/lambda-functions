const fetchRecurringTransaction = require('../../../fetch/recurring-transaction');
const mockRequest = require('../../fixtures/request/getTransactions.json');
const mockResponse = require('../../fixtures/response/fetch-recurring-transaction.json');

const sns = {
  publish: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch RecurringTransaction item', () => {
  test('Without Matching RecurringTransaction: Success', async () => {
    const snsEvents = [];
    const response = await fetchRecurringTransaction
      .getRecurringTransactions(mockRequest['body-json'].walletId, documentClient, snsEvents, sns);
    expect(response).not.toBeUndefined();
    expect(response.RecurringTransactions).not.toBeUndefined();
    expect(response.RecurringTransactions[0].recurringTransactionsId).not.toBeUndefined();
    expect(response.RecurringTransactions[0].walletId).not.toBeUndefined();
    expect(sns.publish).toHaveBeenCalledTimes(1);
    expect(snsEvents.length).toBe(1);
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
