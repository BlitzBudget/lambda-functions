const fetchTransactions = require('../../../fetch/transactions');
const fetchTransactionsResponse = require('../../fixtures/response/fetchTransaction.json');

const dynamoDB = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(fetchTransactionsResponse),
  })),
};

describe('Fetch Transaction item', () => {
  test('With Data: Success', async () => {
    const response = await fetchTransactions
      .getTransactionItems(fetchTransactionsResponse.Items[0].walletId, dynamoDB);
    expect(response).not.toBeUndefined();
  });
});
