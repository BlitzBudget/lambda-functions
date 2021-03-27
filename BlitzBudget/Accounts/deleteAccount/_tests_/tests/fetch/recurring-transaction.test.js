const fetchRecurringTransactions = require('../../../fetch/recurring-transactions');
const fetchRecurringTransactionsResponse = require('../../fixtures/response/fetchRecurringTransaction.json');

const dynamoDB = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(fetchRecurringTransactionsResponse),
  })),
};

describe('Fetch Recurring Transaction item', () => {
  test('With Data: Success', async () => {
    const response = await fetchRecurringTransactions
      .getRecurringTransactionItems(fetchRecurringTransactionsResponse.Items[0].walletId, dynamoDB);
    expect(response).not.toBeUndefined();
  });
});
